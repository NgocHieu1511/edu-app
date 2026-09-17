import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  ArrowRight,
  BookOpen,
  CalendarRange,
  CheckCircle2,
  FileSpreadsheet,
  Sparkles,
  Upload,
} from "lucide-react";

const DEFAULT_ROADMAP_PATH = "/roadmap/learning-path.xlsx";
const STORAGE_KEY = "saved-roadmaps";

const normalizeText = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const normalizeItems = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(normalizeText).filter(Boolean);
  return String(value)
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeHeaderKey = (key) => {
  if (!key) return "";
  return String(key)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .replace(/(^\d+|\s+)/g, "");
};

const pickFirstValue = (row, keys) => {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }

  return "";
};

const ROADMAP_HEADER_ALIASES = {
  phase: ["phase", "giaidoan", "giaidoanhoc", "stage", "chuong", "tuan", "week"],
  title: ["title", "ten", "name", "khocahoc", "khoahoc", "baihoc", "tenbaihoc", "chude", "lesson", "module"],
  duration: ["duration", "thoigian", "thoiluong", "time", "sotuan", "weekcount"],
  summary: ["summary", "description", "mota", "noidung", "muctieu", "ghichu", "note", "content"],
  courses: ["courses", "khoahoc", "course", "items", "danhsachkhoahoc", "chudehoc"],
  skills: ["skills", "kinang", "tags", "stack", "kynang", "congcu", "tools"],
};

const getHeaderScore = (header) => {
  const normalizedHeader = normalizeHeaderKey(header);
  return Object.values(ROADMAP_HEADER_ALIASES).some((aliases) => aliases.includes(normalizedHeader)) ? 1 : 0;
};

const getRowFallbackValues = (row) => Object.values(row)
  .map(normalizeText)
  .filter(Boolean);

const getFallbackDuration = (values) => values.find((value) => /\b(\d+\s*(tuần|tuan|week|tháng|thang|ngày|ngay))\b/i.test(value)) || "4 tuần";

const getFallbackSummary = (values, excludedValues) => values
  .filter((value) => !excludedValues.has(value) && value.length > 35)
  .sort((first, second) => second.length - first.length)[0] ||
  "Phần bắt đầu giúp bạn nắm nền tảng và tạo động lực học tập.";

const getFallbackTitle = (values, duration) => values.find((value) => {
  if (value === duration || /^\d+$/.test(value)) return false;
  if (/^(stt|id|tuần|tuan|giai đoạn|giai doan)\s*\d*$/i.test(value)) return false;
  return value.length > 2;
}) || "Khóa học";

const escapeSvgText = (value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&apos;");

const createRoadmapPreview = (stages, roadmapName) => {
  if (!stages.length) return "";

  const visibleStages = stages.slice(0, 6);
  const stageMarkup = visibleStages.map((stage, index) => {
    const x = 70 + index * 190;
    return `
      <line x1="${x + 28}" y1="170" x2="${x + 160}" y2="170" stroke="#9ccfc5" stroke-width="4" />
      <circle cx="${x + 28}" cy="170" r="28" fill="#1c8d7d" />
      <text x="${x + 28}" y="178" text-anchor="middle" font-family="Arial" font-size="20" font-weight="700" fill="#ffffff">${index + 1}</text>
      <rect x="${x}" y="220" width="160" height="90" rx="14" fill="#ffffff" stroke="#d7e9e5" />
      <text x="${x + 14}" y="247" font-family="Arial" font-size="12" font-weight="700" fill="#4c817b">${escapeSvgText(stage.phase).slice(0, 20)}</text>
      <text x="${x + 14}" y="273" font-family="Arial" font-size="14" font-weight="700" fill="#163e48">${escapeSvgText(stage.title).slice(0, 22)}</text>
      <text x="${x + 14}" y="294" font-family="Arial" font-size="11" fill="#607a7b">${escapeSvgText(stage.duration)}</text>
    `;
  }).join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="380" viewBox="0 0 1280 380">
    <rect width="1280" height="380" fill="#f4faf8" />
    <text x="70" y="72" font-family="Arial" font-size="30" font-weight="700" fill="#123f4a">${escapeSvgText(roadmapName || "Roadmap học tập")}</text>
    <text x="70" y="105" font-family="Arial" font-size="15" fill="#5d7778">Lộ trình được tạo trực tiếp từ file Excel</text>
    ${stageMarkup}
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const parseWorkbookData = (data, fileName) => {
  const workbook = XLSX.read(data, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const matrix = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    raw: false,
    blankrows: false,
  });

  const headerIndex = matrix.reduce(
    (bestIndex, row, index) => {
      const score = row.reduce((total, cell) => total + getHeaderScore(cell), 0);
      const bestScore = matrix[bestIndex]?.reduce((total, cell) => total + getHeaderScore(cell), 0) || 0;
      return score > bestScore ? index : bestIndex;
    },
    0,
  );
  const headers = matrix[headerIndex] || [];
  const rows = matrix.slice(headerIndex + 1)
    .map((row) => headers.reduce((record, header, columnIndex) => {
      record[normalizeHeaderKey(header)] = row[columnIndex] ?? "";
      return record;
    }, {}))
    .filter((row) => Object.values(row).some((value) => normalizeText(value)));

  if (!rows.length) {
    throw new Error("File Excel không có dữ liệu lộ trình.");
  }

  return rows.map((row, index) => {
    const normalized = {};
    Object.entries(row).forEach(([key, value]) => {
      normalized[normalizeHeaderKey(key)] = value;
    });

    const rowValues = getRowFallbackValues(normalized);
    const durationFallback = getFallbackDuration(rowValues);
    const titleFallback = getFallbackTitle(rowValues, durationFallback);
    const summaryFallback = getFallbackSummary(rowValues, new Set([titleFallback, durationFallback]));

    const phase =
      normalizeText(
        pickFirstValue(normalized, ROADMAP_HEADER_ALIASES.phase) ||
          rowValues.find((value) => /^(giai đoạn|giai doan|phase|stage|tuần|tuan|week)\s*\d*/i.test(value)) ||
          `Giai đoạn ${index + 1}`,
      ) || `Giai đoạn ${index + 1}`;
    const title =
      normalizeText(
        pickFirstValue(normalized, ROADMAP_HEADER_ALIASES.title) || titleFallback || `Khóa học ${index + 1}`,
      ) || `Khóa học ${index + 1}`;
    const duration = normalizeText(
      pickFirstValue(normalized, ROADMAP_HEADER_ALIASES.duration) || durationFallback,
    ) || "4 tuần";
    const summary = normalizeText(
      pickFirstValue(normalized, ROADMAP_HEADER_ALIASES.summary) ||
        summaryFallback,
    ) || "Phần bắt đầu giúp bạn nắm nền tảng và tạo động lực học tập.";
    const courses = normalizeItems(
      pickFirstValue(normalized, ROADMAP_HEADER_ALIASES.courses),
    );
    const skills = normalizeItems(
      pickFirstValue(normalized, ROADMAP_HEADER_ALIASES.skills),
    );

    return {
      id: index + 1,
      phase,
      title,
      duration,
      summary,
      courses,
      skills,
      source: fileName,
    };
  });
};

const readRoadmapLibrary = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) && saved.length > 0 ? saved : [
      {
        id: "default-roadmap",
        name: "Lộ trình web cơ bản",
        fileName: "learning-path.xlsx",
        fileUrl: DEFAULT_ROADMAP_PATH,
      },
    ];
  } catch {
    return [
      {
        id: "default-roadmap",
        name: "Lộ trình web cơ bản",
        fileName: "learning-path.xlsx",
        fileUrl: DEFAULT_ROADMAP_PATH,
      },
    ];
  }
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Không thể đọc file Excel."));
    reader.readAsDataURL(file);
  });

function RoadmapPage() {
  const fileInputRef = useRef(null);
  const [roadmaps, setRoadmaps] = useState(() => readRoadmapLibrary());
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(() => {
    const savedRoadmaps = readRoadmapLibrary();
    return savedRoadmaps[savedRoadmaps.length - 1]?.id || "";
  });
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFile, setActiveFile] = useState("learning-path.xlsx");
  const [roadmapName, setRoadmapName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedRoadmap = useMemo(
    () => roadmaps.find((item) => item.id === selectedRoadmapId) || roadmaps[0] || null,
    [roadmaps, selectedRoadmapId],
  );
  const roadmapImage = selectedRoadmap?.imageDataUrl || createRoadmapPreview(stages, selectedRoadmap?.name);

  const loadRoadmapFromItem = useCallback(async (item) => {
    try {
      setLoading(true);
      setError("");

      if (!item) {
        setStages([]);
        setActiveFile("Chưa có lộ trình");
        return;
      }

      if (item.fileUrl) {
        const response = await fetch(item.fileUrl);
        if (!response.ok) {
          throw new Error("Không thể tải file Excel của roadmap.");
        }
        const buffer = await response.arrayBuffer();
        const parsed = parseWorkbookData(buffer, item.fileName || "learning-path.xlsx");
        setStages(parsed);
        setActiveFile(item.fileName || "learning-path.xlsx");
        return;
      }

      if (item.dataUrl) {
        const base64 = item.dataUrl.split(",")[1];
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index += 1) {
          bytes[index] = binary.charCodeAt(index);
        }
        const parsed = parseWorkbookData(bytes, item.fileName || "roadmap.xlsx");
        setStages(parsed);
        setActiveFile(item.fileName || "roadmap.xlsx");
      }
    } catch (loadError) {
      setError(loadError.message || "Có lỗi khi tải dữ liệu lộ trình.");
      setStages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedRoadmap) return;

    const loadId = window.setTimeout(() => {
      void loadRoadmapFromItem(selectedRoadmap);
    }, 0);

    return () => window.clearTimeout(loadId);
  }, [loadRoadmapFromItem, selectedRoadmap]);

  const handleAddRoadmap = async (event) => {
    event.preventDefault();
    const file = event.target.elements?.roadmapFile?.files?.[0];

    if (!roadmapName.trim()) {
      setError("Vui lòng nhập tên roadmap.");
      return;
    }

    if (!file) {
      setError("Vui lòng chọn file Excel roadmap.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const dataUrl = await fileToDataUrl(file);
      const nextRoadmap = {
        id: `${Date.now()}`,
        name: roadmapName.trim(),
        fileName: file.name,
        dataUrl,
      };

      const imageFile = event.target.elements?.roadmapImage?.files?.[0];
      if (imageFile) {
        nextRoadmap.imageDataUrl = await fileToDataUrl(imageFile);
      }

      const nextRoadmaps = [...readRoadmapLibrary(), nextRoadmap];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRoadmaps));
      setRoadmaps(nextRoadmaps);
      setSelectedRoadmapId(nextRoadmap.id);
      setRoadmapName("");
      event.target.reset();
    } catch (addError) {
      setError(addError.message || "Không thể lưu roadmap.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError("");
      const buffer = await file.arrayBuffer();
      const parsed = parseWorkbookData(buffer, file.name);
      setStages(parsed);
      setActiveFile(file.name);
    } catch (uploadError) {
      setError(uploadError.message || "File chưa đúng định dạng Excel.");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="roadmap-page">
      <div className="roadmap-hero">
        <div className="roadmap-shell">
          <div className="roadmap-header-row">
            <div>
              <p className="roadmap-eyebrow">LỘ TRÌNH HỌC</p>
              <h1>
                Chọn lộ trình học <span>phù hợp nhất với bạn.</span>
              </h1>
            </div>
            <div className="roadmap-actions">
              <button type="button" className="roadmap-upload-button" onClick={() => fileInputRef.current?.click()}>
                <Upload size={16} />
                Tải file Excel
              </button>
              <a href={DEFAULT_ROADMAP_PATH} download className="roadmap-download-link">
                <FileSpreadsheet size={16} />
                Mẫu Excel
              </a>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            hidden
          />

          <div className="roadmap-summary-card">
            <div>
              <span>File đang hiển thị</span>
              <strong>{activeFile}</strong>
            </div>
            <div>
              <span>Số giai đoạn</span>
              <strong>{stages.length}</strong>
            </div>
            <div>
              <span>Phương pháp</span>
              <strong>Thực chiến + lộ trình rõ ràng</strong>
            </div>
          </div>

          {selectedRoadmap && (selectedRoadmap.dataUrl || selectedRoadmap.fileUrl) && (
            <a
              className="roadmap-active-file-link"
              href={selectedRoadmap.dataUrl || selectedRoadmap.fileUrl}
              download={selectedRoadmap.fileName || "roadmap.xlsx"}
            >
              <FileSpreadsheet size={16} />
              Tải file Excel đang hiển thị: {selectedRoadmap.fileName}
            </a>
          )}
        </div>
      </div>

      <div className="roadmap-shell roadmap-content">
        <div className="roadmap-admin-panel">
          <div className="roadmap-admin-header">
            <span>Roadmap của khóa học</span>
            <strong>{roadmaps.length}</strong>
          </div>

          <form className="roadmap-form" onSubmit={handleAddRoadmap}>
            <div className="roadmap-form-group">
              <label htmlFor="roadmap-name">Tên roadmap</label>
              <input
                id="roadmap-name"
                name="roadmapName"
                type="text"
                value={roadmapName}
                onChange={(event) => setRoadmapName(event.target.value)}
                placeholder="Ví dụ: Lộ trình Frontend 2026"
              />
            </div>

            <div className="roadmap-form-group">
              <label htmlFor="roadmap-file">File roadmap Excel</label>
              <input id="roadmap-file" name="roadmapFile" type="file" accept=".xlsx,.xls,.csv" />
            </div>

            <div className="roadmap-form-group">
              <label htmlFor="roadmap-image">Ảnh roadmap</label>
              <input id="roadmap-image" name="roadmapImage" type="file" accept="image/*" />
            </div>

            <button type="submit" className="roadmap-submit-button" disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : "Thêm roadmap"}
            </button>
          </form>

          <div className="roadmap-list">
            {roadmaps.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`roadmap-item-button ${selectedRoadmap?.id === item.id ? "selected" : ""}`}
                onClick={() => setSelectedRoadmapId(item.id)}
              >
                <span className="roadmap-list-dot" />
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.fileName}</small>
                </div>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="roadmap-state-card">Đang đọc dữ liệu lộ trình...</div>
        ) : error ? (
          <div className="roadmap-state-card error">{error}</div>
        ) : (
          <div>
            {roadmapImage && (
              <div className="roadmap-image-panel">
                <img
                  src={roadmapImage}
                  alt={`Ảnh roadmap ${selectedRoadmap.name}`}
                  className="roadmap-image"
                />
              </div>
            )}

            <div className="roadmap-timeline">
              {stages.map((stage, index) => (
                <div key={`${stage.phase}-${index}`} className="roadmap-item">
                  <div className="roadmap-marker">
                    <span>{index + 1}</span>
                  </div>
                  <div className="roadmap-card">
                    <div className="roadmap-card-top">
                      <div>
                        <small>{stage.phase}</small>
                        <h2>{stage.title}</h2>
                      </div>
                      <div className="roadmap-duration">
                        <CalendarRange size={14} />
                        {stage.duration}
                      </div>
                    </div>

                    <p>{stage.summary}</p>

                    {stage.skills.length > 0 && (
                      <div className="roadmap-tags">
                        {stage.skills.map((skill) => (
                          <span key={`${stage.id}-${skill}`} className="roadmap-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {stage.courses.length > 0 && (
                      <div className="roadmap-course-list">
                        <div className="roadmap-course-label">
                          <BookOpen size={14} />
                          Khóa học / chủ đề
                        </div>
                        <ul>
                          {stage.courses.map((course) => (
                            <li key={`${stage.id}-${course}`}>
                              <CheckCircle2 size={14} />
                              {course}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="roadmap-footnote">
          <div className="roadmap-footnote-icon">
            <Sparkles size={18} />
          </div>
          <div>
            <strong>Gợi ý học tập:</strong>
            <p>
              Hãy hoàn thành từng giai đoạn theo thứ tự, sau mỗi phần làm một mini-project để ghi nhớ kiến thức tốt hơn.
            </p>
          </div>
          <a href="/courses">
            Khám phá khóa học <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default RoadmapPage;
