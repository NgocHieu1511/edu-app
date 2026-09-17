import Course from "../models/course.model.js";
import Blog from "../models/blog.model.js";

const trimText = (value, maxLength = 600) => String(value || "").slice(0, maxLength);

const getWebsiteContext = async () => {
  const [courses, blogs] = await Promise.all([
    Course.find().select("title description category price instructor").limit(50).lean(),
    Blog.find().select("title excerpt content author createdAt").sort({ createdAt: -1 }).limit(20).lean(),
  ]);

  return {
    courses: courses.map((course) => ({
      title: trimText(course.title, 160),
      description: trimText(course.description),
      category: trimText(course.category, 80),
      price: course.price,
      instructor: trimText(course.instructor, 100),
    })),
    blogs: blogs.map((blog) => ({
      title: trimText(blog.title, 160),
      excerpt: trimText(blog.excerpt),
      content: trimText(blog.content, 800),
      author: trimText(blog.author, 100),
    })),
  };
};

const buildSystemPrompt = (context) => `Bạn là NNH AI, trợ lý học tập của NNH Academy.
Trả lời bằng tiếng Việt tự nhiên, ngắn gọn, rõ ràng và hữu ích.
Chỉ khẳng định thông tin có trong dữ liệu website bên dưới. Nếu dữ liệu không có câu trả lời, hãy nói rõ rằng bạn chưa tìm thấy thông tin và đề nghị người dùng liên hệ quản trị viên.
Không bịa khóa học, giá, giảng viên, bài viết hoặc chính sách.

DỮ LIỆU WEBSITE HIỆN TẠI:
${JSON.stringify(context)}`;

const callOpenAI = async (messages) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages,
      temperature: 0.3,
      max_tokens: 600,
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error?.message || "OpenAI request failed");
  }

  return payload.choices?.[0]?.message?.content?.trim();
};

const callGemini = async (messages) => {
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: messages[0].content }] },
        contents: [{ role: "user", parts: [{ text: messages[1].content }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 600 },
      }),
    },
  );

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error?.message || "Gemini request failed");
  }

  return payload.candidates?.[0]?.content?.parts?.map((part) => part.text).join("").trim();
};

export const chatWithAI = async (req, res) => {
  const message = String(req.body?.message || "").trim();

  if (!message) {
    return res.status(400).json({ success: false, message: "Message is required" });
  }

  if (message.length > 2000) {
    return res.status(400).json({ success: false, message: "Message is too long" });
  }

  const provider = String(process.env.AI_PROVIDER || "").toLowerCase();
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);

  if ((provider === "openai" && !hasOpenAI) || (provider === "gemini" && !hasGemini) || (!provider && !hasOpenAI && !hasGemini)) {
    return res.status(503).json({
      success: false,
      code: "AI_NOT_CONFIGURED",
      message: "AI provider is not configured",
    });
  }

  try {
    const context = await getWebsiteContext();
    const messages = [
      { role: "system", content: buildSystemPrompt(context) },
      { role: "user", content: message },
    ];
    const selectedProvider = provider || (hasOpenAI ? "openai" : "gemini");
    const reply = selectedProvider === "gemini" ? await callGemini(messages) : await callOpenAI(messages);

    return res.json({ success: true, provider: selectedProvider, reply: reply || "Tôi chưa tạo được câu trả lời phù hợp." });
  } catch (error) {
    console.error("AI chat error:", error.message);
    return res.status(502).json({ success: false, message: "AI provider temporarily unavailable" });
  }
};