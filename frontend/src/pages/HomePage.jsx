import { Fragment, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import FeaturedCourses from "../components/FeaturedCourses";
import { ArrowRight, BookOpen, Code2, Play, Users, Zap, Trophy, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "studyReminders";

const formatDateText = (dateValue) => {
  if (!dateValue) return "Chưa cập nhật";

  const parsedDate = dateValue.includes("T")
    ? new Date(dateValue)
    : new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Chưa cập nhật";
  }

  return parsedDate.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function HomePage() {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const readReminders = () => {
      try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        setReminders(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch {
        setReminders([]);
      }
    };

    readReminders();
    window.addEventListener("study-reminders-updated", readReminders);

    return () => {
      window.removeEventListener("study-reminders-updated", readReminders);
    };
  }, []);

  return (
    <MainLayout>
      <div className="home-app-notices">
        <div className="notice-ticker">
          {reminders.length > 0 ? (
            reminders.map((item, index) => (
              <Fragment key={item.id || `${item.lessonName}-${index}`}>
                <span>HẠN: {formatDateText(item.dueDate)}</span>
                <strong>{item.lessonName}</strong>
                {index < reminders.length - 1 && <i />}
              </Fragment>
            ))
          ) : (
            <>
              <span>5 PHÚT TRƯỚC</span>
              <strong>Nguyễn Minh vừa đăng ký khóa học</strong>
              <i />
              <span>18 PHÚT TRƯỚC</span>
              <strong>Phạm An vừa hoàn thành bài học</strong>
            </>
          )}
        </div>
        <div className="notice-promo">
          <span className="promo-label"><Zap size={13} /> NHẮC NHỞ HỌC TẬP</span>
          <strong>Hạn nộp bài mới đang tới</strong>
          <span className="promo-copy">Đừng quên upload video bài học đúng thời hạn</span>
          <Link to="/my-courses">Xem lời nhắc <ArrowRight size={15} /></Link>
        </div>
      </div>
      <section className="home-hero app-hero">
        <div className="home-shell home-hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> NỀN TẢNG HỌC LẬP TRÌNH</p>
            <h1>Học code thật kỹ.<br /><em>Làm được thật.</em></h1>
            <p className="hero-lead">Từ bài học đầu tiên đến dự án hoàn chỉnh. Học theo lộ trình rõ ràng, thực hành ngay và luôn có cộng đồng đồng hành.</p>
            <div className="hero-actions"><Link to="/courses" className="button button-primary">Bắt đầu học miễn phí <ArrowRight size={17} /></Link><Link to="/blog" className="button button-quiet"><Play size={15} fill="currentColor" /> Xem cách học</Link></div>
            <div className="hero-proof"><div className="avatar-stack"><span>H</span><span>N</span><span>T</span><span>+</span></div><span>Được chọn bởi hơn <strong>5,000</strong> học viên</span></div>
          </div>
          <div className="learning-preview" aria-label="Tổng quan tiến độ học tập">
            <div className="preview-top"><span><i /> NNH ACADEMY</span><small>Học tập của tôi</small></div>
            <div className="preview-welcome"><div><small>CHÀO BUỔI HỌC, HỌC VIÊN</small><h3>Tiếp tục hành trình của bạn</h3></div><div className="progress-ring">68<span>%</span></div></div>
            <div className="preview-course"><div className="course-icon"><Code2 size={23} /></div><div><small>ĐANG HỌC</small><strong>JavaScript từ cơ bản đến nâng cao</strong><div className="mini-progress"><span /></div><em>12 / 24 bài học</em></div><ArrowRight size={18} /></div>
            <div className="preview-bottom"><span><Trophy size={15} /> 7 ngày học liên tục</span><span><MessageCircle size={15} /> 24/7 cộng đồng</span></div>
          </div>
        </div>
        <div className="home-shell stats-strip"><div><strong>999+</strong><span>Bài giảng</span></div><div><strong>20+</strong><span>Khóa học</span></div><div><strong>10+</strong><span>Ngôn ngữ</span></div><div><strong>24/7</strong><span>Cộng đồng Discord</span></div></div>
      </section>
      <section className="home-section path-section"><div className="home-shell"><div className="section-heading"><div><p className="eyebrow">BẮT ĐẦU TỪ ĐÂY</p><h2>Chọn hướng đi của bạn</h2></div><Link to="/courses" className="text-link">Xem tất cả khóa học <ArrowRight size={16} /></Link></div><div className="path-grid">
        <Link to="/courses" className="path-card path-card-featured"><span className="path-number">01</span><Code2 size={28} /><h3>Bắt đầu với Web</h3><p>HTML, CSS, JavaScript nền tảng. Hiểu cách trang web hoạt động và làm sản phẩm đầu tay.</p><span className="tag-row"><small>HTML</small><small>CSS</small><small>JS</small></span></Link>
        <Link to="/courses" className="path-card"><span className="path-number">02</span><BookOpen size={25} /><h3>Chọn ngôn ngữ chuyên sâu</h3><p>Python cho data, Java cho doanh nghiệp, C++ cho thuật toán.</p><span className="tag-row"><small>Python</small><small>Java</small><small>C++</small></span></Link>
        <Link to="/courses" className="path-card"><span className="path-number">03</span><Users size={25} /><h3>Backend & dự án thật</h3><p>REST API, database và sản phẩm hoàn chỉnh để đưa lên GitHub.</p><span className="tag-row"><small>Node</small><small>API</small><small>GitHub</small></span></Link>
      </div></div></section>
      <FeaturedCourses />
      <section className="home-cta"><div className="home-shell cta-inner"><div><p className="eyebrow">HỌC ĐỀU, TIẾN XA</p><h2>Một bài hôm nay.<br /><em>Một kỹ năng cho ngày mai.</em></h2></div><Link to="/register" className="button button-light">Tạo tài khoản miễn phí <ArrowRight size={17} /></Link></div></section>
    </MainLayout>
  );
}

export default HomePage;
