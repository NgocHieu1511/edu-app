import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Code2, MessageCircle, Play, Trophy, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import FeaturedCourses from "../components/FeaturedCourses";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const STORAGE_KEY = "studyReminders";

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
    return () => window.removeEventListener("study-reminders-updated", readReminders);
  }, []);

  return (
    <MainLayout>
      <div className="shadcn-home">
        <div className="shadcn-home-notice">
          <span><Zap size={14} /> HỌC TẬP TẬP TRUNG</span>
          <strong>{reminders.length > 0 ? `${reminders.length} lời nhắc đang chờ bạn` : "Lộ trình mới: JavaScript thực chiến đã mở"}</strong>
          <Link to="/my-courses">Xem tiến độ <ArrowRight size={14} /></Link>
        </div>
        <section className="shadcn-hero">
          <div className="shadcn-shell shadcn-hero-grid">
            <div className="shadcn-hero-copy">
              <Badge variant="warm">NNH ACADEMY / 2026</Badge>
              <h1>Học để tạo ra điều <span>có ích.</span></h1>
              <p>Khóa học lập trình thực tế, ngắn gọn và có lộ trình. Mỗi ngày một bài học, mỗi tháng một sản phẩm mới.</p>
              <div className="shadcn-hero-actions">
                <Link to="/courses"><Button variant="accent" size="lg">Khám phá khóa học <ArrowRight size={18} /></Button></Link>
                <Link to="/blog"><Button variant="outline" size="lg"><Play size={16} fill="currentColor" /> Xem cách học</Button></Link>
              </div>
              <div className="shadcn-trust"><div className="shadcn-avatar-stack"><span>H</span><span>M</span><span>T</span><span>+</span></div><span>Được tin chọn bởi <strong>5,000+</strong> học viên</span></div>
            </div>
            <Card className="shadcn-dashboard-card">
              <CardContent>
                <div className="shadcn-dashboard-top"><span><i /> BẢNG ĐIỀU KHIỂN</span><Badge>Đang học</Badge></div>
                <div className="shadcn-dashboard-intro"><div><small>CHÀO BUỔI HỌC, MINH</small><h2>Tiếp tục hành trình</h2><p>Bạn đang đi đúng hướng. Giữ nhịp học hôm nay nhé.</p></div><div className="shadcn-progress-ring">68<small>%</small></div></div>
                <div className="shadcn-current-course"><div className="shadcn-course-icon"><Code2 size={24} /></div><div><small>KHÓA HỌC TIẾP THEO</small><strong>JavaScript từ cơ bản đến nâng cao</strong><div className="shadcn-progress"><span /></div><em>12 / 24 bài học</em></div><ArrowRight size={18} /></div>
                <div className="shadcn-dashboard-footer"><span><Trophy size={15} /> 7 ngày liên tục</span><span><MessageCircle size={15} /> Cộng đồng 24/7</span></div>
              </CardContent>
            </Card>
          </div>
          <div className="shadcn-shell shadcn-metrics"><div><strong>999+</strong><span>Bài giảng</span></div><div><strong>20+</strong><span>Khóa học</span></div><div><strong>10+</strong><span>Ngôn ngữ</span></div><div><strong>24/7</strong><span>Cộng đồng</span></div></div>
        </section>
        <section className="shadcn-path-section">
          <div className="shadcn-shell">
            <div className="shadcn-section-heading"><div><Badge variant="subtle">LỘ TRÌNH RÕ RÀNG</Badge><h2>Chọn điểm bắt đầu.</h2><p>Không cần biết tất cả. Chỉ cần bắt đầu đúng thứ tự.</p></div><Link to="/courses" className="shadcn-link">Xem tất cả <ArrowRight size={16} /></Link></div>
            <div className="shadcn-path-grid">
              <Link to="/courses"><Card className="shadcn-path-card shadcn-path-card-main"><CardContent><span className="shadcn-path-index">01 / NỀN TẢNG</span><Code2 size={28} /><h3>Bắt đầu với Web</h3><p>HTML, CSS và JavaScript để tự tay đưa ý tưởng lên màn hình.</p><span className="shadcn-tags"><small>HTML</small><small>CSS</small><small>JS</small></span></CardContent></Card></Link>
              <Link to="/courses"><Card className="shadcn-path-card"><CardContent><span className="shadcn-path-index">02 / CHUYÊN SÂU</span><BookOpen size={28} /><h3>Chọn ngôn ngữ</h3><p>Python, Java, C++ và tư duy giải quyết vấn đề.</p><span className="shadcn-tags"><small>PYTHON</small><small>JAVA</small></span></CardContent></Card></Link>
              <Link to="/courses"><Card className="shadcn-path-card"><CardContent><span className="shadcn-path-index">03 / XÂY DỰNG</span><Users size={28} /><h3>Làm dự án thật</h3><p>Backend, database và sản phẩm để đưa lên GitHub.</p><span className="shadcn-tags"><small>NODE</small><small>API</small></span></CardContent></Card></Link>
            </div>
          </div>
        </section>
        <FeaturedCourses />
        <section className="shadcn-final-cta"><div className="shadcn-shell"><div><Badge variant="warm">MỖI NGÀY MỘT BƯỚC</Badge><h2>Hôm nay học gì<br /><span>để ngày mai giỏi hơn?</span></h2></div><Link to="/register"><Button size="lg">Tạo tài khoản miễn phí <ArrowRight size={18} /></Button></Link></div></section>
      </div>
    </MainLayout>
  );
}

export default HomePage;