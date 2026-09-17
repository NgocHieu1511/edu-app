import { useState } from "react";
import { Bot, MessageCircle, SendHorizonal, Sparkles, X } from "lucide-react";
import { chatWithAI as requestAIReply } from "../api/aiApi";

const quickPrompts = [
  "Khóa học phù hợp cho người mới",
  "Lộ trình học web",
  "Tôi muốn học Python",
  "Học phí và đăng ký",
  "Cách học hiệu quả",
];

function getBotReply(input) {
  const message = String(input || "").trim().toLowerCase();

  if (!message) {
    return "Bạn muốn hỏi về khóa học, lộ trình học, hoặc cách đăng ký? Tôi có thể hỗ trợ ngay.";
  }

  if (/xin chào|hello|hi|chào/.test(message)) {
    return "Xin chào! Tôi là trợ lý AI của NNH Academy. Bạn muốn bắt đầu học gì: web, Python, backend, hay cần tư vấn lộ trình?";
  }

  if (/khóa học|course|học gì|gợi ý/.test(message)) {
    return "Nếu bạn mới bắt đầu, tôi khuyên bạn nên học theo lộ trình: HTML/CSS → JavaScript → React → Node.js/Backend. Nếu muốn học data hoặc Python, có thể bắt đầu từ Python căn bản rồi ứng dụng vào dự án thực tế.";
  }

  if (/web|frontend|html|css|javascript|react/.test(message)) {
    return "Lộ trình web hiệu quả cho người mới: 1) HTML/CSS, 2) JavaScript cơ bản, 3) ES6 + DOM, 4) React, 5) dự án mini. Mỗi tuần nên hoàn thành 1 bài học và 1 mini project để ghi nhớ kiến thức.";
  }

  if (/python|backend|node|api|sql/.test(message)) {
    return "Python và backend là lựa chọn rất tốt cho việc xây dựng ứng dụng thực tế. Bạn có thể học Python nền tảng, sau đó làm API với Flask/FastAPI hoặc Node.js, rồi kết hợp database và deploy.";
  }

  if (/lộ trình|path|bắt đầu|học từ đâu/.test(message)) {
    return "Tôi recommend bạn chọn theo mục tiêu: nếu muốn lập trình web → học web front-end; nếu muốn xây dựng ứng dụng → học Python hoặc JavaScript backend; nếu muốn data/AI → bắt đầu Python. Mỗi lộ trình nên tối thiểu 8-12 tuần với 3-4 buổi học mỗi tuần.";
  }

  if (/blog|bài viết|tin tức|content/.test(message)) {
    return "Bạn có thể xem phần Blog trên website để tìm bài học, mẹo học tập và các chủ đề công nghệ mới nhất. Tôi cũng có thể gợi ý bài viết phù hợp với mục tiêu học của bạn.";
  }

  if (/giá|học phí|price|đăng ký|register|tài khoản/.test(message)) {
    return "Bạn có thể bắt đầu với tài khoản miễn phí để xem các bài học mẫu và lộ trình. Nếu muốn học chuyên sâu hơn, hãy chọn gói phù hợp với mục tiêu: người mới, nâng cao, hoặc dự án thực tế.";
  }

  if (/mục tiêu|cách học|hiệu quả|study|học tập/.test(message)) {
    return "Cách học hiệu quả là: học ngắn mỗi ngày, làm bài tập ngay, viết lại code bằng tay, và hoàn thành 1 dự án nhỏ mỗi 2-3 tuần. Học dài nhưng đều sẽ hiệu quả hơn là học dồn.";
  }

  if (/cảm ơn|thanks|ok/.test(message)) {
    return "Rất vui được hỗ trợ. Nếu bạn muốn, tôi có thể đề xuất một lộ trình học 30 ngày cho bạn ngay.";
  }

  return "Tôi hiểu bạn đang quan tâm đến việc học tập trên nền tảng này. Bạn có thể hỏi tôi về khóa học, lộ trình, học phí, hoặc cách bắt đầu học hiệu quả. Tôi sẽ gợi ý chi tiết hơn dựa trên mục tiêu của bạn.";
}

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Xin chào! Tôi là trợ lý AI của NNH Academy. Hãy hỏi tôi về khóa học, lộ trình học, hoặc cách đăng ký.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (value) => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { sender: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await requestAIReply(trimmed);
      setMessages((prev) => [...prev, { sender: "ai", text: response.data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: getBotReply(trimmed),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-chatbot-widget">
      {!isOpen ? (
        <button
          type="button"
          className="ai-chatbot-launcher"
          onClick={() => setIsOpen(true)}
          aria-label="Mở chatbot AI"
        >
          <MessageCircle size={20} />
          <span>AI</span>
        </button>
      ) : (
        <div className="ai-chatbot-panel" role="dialog" aria-label="Chatbot AI">
          <div className="ai-chatbot-header">
            <div className="ai-chatbot-title-wrap">
              <div className="ai-chatbot-icon">
                <Bot size={18} />
              </div>
              <div>
                <strong>NNH AI</strong>
                <small>Trợ lý học tập</small>
              </div>
            </div>
            <button
              type="button"
              className="ai-chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Đóng chatbot"
            >
              <X size={16} />
            </button>
          </div>

          <div className="ai-chatbot-body">
            {messages.map((message, index) => (
              <div
                key={`${message.sender}-${index}`}
                className={`ai-chatbot-message ${message.sender === "user" ? "user" : "ai"}`}
              >
                {message.text}
              </div>
            ))}
            {isLoading && <div className="ai-chatbot-message ai">Đang đọc dữ liệu website...</div>}
          </div>

          <div className="ai-chatbot-quick-actions">
            {quickPrompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => void handleSend(prompt)} disabled={isLoading}>
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="ai-chatbot-form"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSend(input);
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              aria-label="Nhập câu hỏi cho chatbot"
            />
            <button type="submit" aria-label="Gửi câu hỏi" disabled={isLoading}>
              <SendHorizonal size={16} />
            </button>
          </form>

          <div className="ai-chatbot-footer">
            <Sparkles size={12} />
            AI trả lời theo nội dung website
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatbotWidget;
