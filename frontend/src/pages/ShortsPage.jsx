import { useEffect, useState } from "react";
import { BookOpen, Heart, MessageCircle, Share2, Video } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { getCourses } from "../api/courseApi";
import { getLessonsByCourse } from "../api/lessonApi";

const getYouTubeId = (url) => {
  if (!url) return "";

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return "";
};

function ShortsPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShorts = async () => {
      try {
        const coursesResponse = await getCourses();
        const courses = coursesResponse.data?.courses || [];

        const shorts = [];

        for (const course of courses) {
          try {
            const lessonsResponse = await getLessonsByCourse(course._id);
            const lessons = lessonsResponse.data?.lessons || [];

            lessons.forEach((lesson) => {
              if (!lesson.videoUrl) return;

              shorts.push({
                id: lesson._id,
                title: lesson.title,
                description: lesson.description,
                videoUrl: lesson.videoUrl,
                courseTitle: course.title,
                youtubeId: getYouTubeId(lesson.videoUrl),
              });
            });
          } catch (error) {
            console.error("Error fetching lessons for course", course._id, error);
          }
        }

        setVideos(shorts);
      } catch (error) {
        console.error("Error loading shorts", error);
      } finally {
        setLoading(false);
      }
    };

    loadShorts();
  }, []);

  return (
    <MainLayout>
      <div className="shorts-feed-shell">
        <div className="shorts-feed-header">
          <div>
            <p className="shorts-eyebrow">Video ngắn</p>
            <h1>Shorts học tập</h1>
          </div>
          <div className="shorts-header-badge">
            <Video size={16} />
            {videos.length} video
          </div>
        </div>

        {loading ? (
          <div className="shorts-loading">Đang tải video ngắn...</div>
        ) : videos.length === 0 ? (
          <div className="shorts-empty">Chưa có video nào để hiển thị.</div>
        ) : (
          <div className="shorts-feed">
            {videos.map((video, index) => (
              <div className="short-video-card" key={video.id || index}>
                <div className="short-video-shell">
                  {video.youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${video.youtubeId}`}
                      title={video.title}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={video.videoUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls={false}
                    />
                  )}
                </div>

                <div className="short-side-actions">
                  <button type="button" className="short-action-btn">
                    <Heart size={20} />
                    <span>12K</span>
                  </button>
                  <button type="button" className="short-action-btn">
                    <MessageCircle size={20} />
                    <span>320</span>
                  </button>
                  <button type="button" className="short-action-btn">
                    <Share2 size={20} />
                    <span>Chia sẻ</span>
                  </button>
                </div>

                <div className="short-info-panel">
                  <div className="short-label-row">
                    <BookOpen size={14} />
                    <span>{video.courseTitle}</span>
                  </div>
                  <h3>{video.title}</h3>
                  <p>{video.description || "Video ngắn học nhanh, dễ hiểu và dễ nhớ."}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default ShortsPage;
