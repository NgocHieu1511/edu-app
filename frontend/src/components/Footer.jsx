import { ArrowUpRight, BookOpen, Globe, Mail, Send, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";

const learningLinks = [
	{ to: "/courses", label: "Khóa học" },
	{ to: "/my-courses", label: "Lộ trình của tôi" },
	{ to: "/attendance", label: "Chấm công" },
	{ to: "/rewards", label: "Phần thưởng" },
];

const exploreLinks = [
	{ to: "/blog", label: "Blog kiến thức" },
	{ to: "/shorts", label: "Video ngắn" },
	{ to: "/", label: "Về NNH Academy" },
];

function Footer() {
	return (
		<footer className="site-footer">
			<div className="site-footer-inner">
				<div className="site-footer-main">
					<div className="site-footer-brand">
						<Link to="/" className="site-footer-logo">
							<span><BookOpen size={21} /></span>
							<strong>NNH Academy</strong>
						</Link>
						<Badge variant="warm">HỌC ĐỂ LÀM ĐƯỢC</Badge>
						<p>Học lập trình theo cách rõ ràng hơn: từng bài học nhỏ, từng sản phẩm thật.</p>
						<div className="site-footer-socials" aria-label="Mạng xã hội">
							  <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><Globe size={17} /></a>
							  <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><Users size={17} /></a>
							  <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Globe size={17} /></a>
							<a href="mailto:hello@nnhacademy.com" aria-label="Email"><Mail size={17} /></a>
						</div>
					</div>

					<div className="site-footer-links">
						<div><h3>Học tập</h3>{learningLinks.map((link) => <Link key={link.to} to={link.to}>{link.label}<ArrowUpRight size={13} /></Link>)}</div>
						<div><h3>Khám phá</h3>{exploreLinks.map((link) => <Link key={link.label} to={link.to}>{link.label}<ArrowUpRight size={13} /></Link>)}</div>
					</div>

					<div className="site-footer-newsletter">
						<h3>Giữ nhịp học</h3>
						<p>Nhận bài học mới và những gợi ý thực hành hữu ích mỗi tuần.</p>
						<form onSubmit={(event) => event.preventDefault()}>
							<label className="sr-only" htmlFor="footer-email">Email của bạn</label>
							<div><Mail size={16} /><input id="footer-email" type="email" placeholder="Email của bạn" required /><button type="submit" aria-label="Đăng ký nhận tin"><Send size={16} /></button></div>
						</form>
					</div>
				</div>

				<div className="site-footer-bottom"><span>© 2026 NNH Academy. Học tập không giới hạn.</span><div><Link to="/">Điều khoản</Link><Link to="/">Quyền riêng tư</Link><span className="site-footer-status"><i /> Hệ thống đang hoạt động</span></div></div>
			</div>
		</footer>
	);
}

export default Footer;
