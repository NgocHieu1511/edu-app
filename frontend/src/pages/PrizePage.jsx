import { useEffect, useMemo, useState } from "react";
import { Gift, Image as ImageIcon, Sparkles, Trophy, X, Star, Zap } from "lucide-react";
import MainLayout from "../layouts/MainLayout";

const LESSON_COUNT_KEY = "adminLessonCount";
const PRIZE_KEY = "rewardLadder";
const CLAIMED_KEY = "claimedRewardIds";

const defaultRewards = [
  {
    id: "reward-1",
    title: "Ladder 1",
    description: "Mỗi 5 bài học đầu tiên sẽ mở khóa thưởng đầu tiên.",
    imageUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "reward-2",
    title: "Ladder 2",
    description: "Đạt 10 bài học để nhận phần thưởng tiếp theo.",
    imageUrl: "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "reward-3",
    title: "Ladder 3",
    description: "Đạt 15 bài học để nhận phần thưởng lớn hơn.",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "reward-4",
    title: "Ladder 4",
    description: "Đạt 20 bài học và nhận thưởng premium.",
    imageUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "reward-5",
    title: "Ladder 5",
    description: "Đạt 25 bài học để nhận phần thưởng cao nhất.",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  },
];

const readStoredValue = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;
    return JSON.parse(item);
  } catch (error) {
    return fallback;
  }
};

function PrizePage() {
  const [lessonCount, setLessonCount] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [claimedRewardIds, setClaimedRewardIds] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", imageUrl: "" });

  useEffect(() => {
    const count = Number(readStoredValue(LESSON_COUNT_KEY, 0) || 0);
    setLessonCount(Number.isFinite(count) ? count : 0);

    const savedRewards = readStoredValue(PRIZE_KEY, defaultRewards);
    setRewards(Array.isArray(savedRewards) && savedRewards.length > 0 ? savedRewards : defaultRewards);

    const claimed = readStoredValue(CLAIMED_KEY, []);
    setClaimedRewardIds(Array.isArray(claimed) ? claimed : []);
  }, []);

  useEffect(() => {
    localStorage.setItem(PRIZE_KEY, JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem(CLAIMED_KEY, JSON.stringify(claimedRewardIds));
  }, [claimedRewardIds]);

  const ladderRewards = useMemo(() => {
    return Array.from({ length: 5 }, (_, index) => {
      const threshold = (index + 1) * 5;
      const reward = rewards[index] || {
        id: `reward-${index + 1}`,
        title: `Ladder ${index + 1}`,
        description: "Phần thưởng do admin thêm mới.",
        imageUrl: "",
      };

      return {
        ...reward,
        threshold,
        unlocked: lessonCount >= threshold,
        claimed: claimedRewardIds.includes(reward.id),
      };
    });
  }, [claimedRewardIds, lessonCount, rewards]);

  const nextThreshold = useMemo(() => {
    const next = 5 - (lessonCount % 5);
    return lessonCount % 5 === 0 ? 5 : next;
  }, [lessonCount]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const title = form.title.trim();
    const description = form.description.trim();
    const imageUrl = form.imageUrl.trim();

    if (!title && !description && !imageUrl) {
      return;
    }

    const newReward = {
      id: `custom-${Date.now()}`,
      title: title || "Phần thưởng mới",
      description:
        description || "Phần thưởng dành cho học viên hoàn thành tiến độ học tập.",
      imageUrl: imageUrl || "",
    };

    setRewards((prev) => [newReward, ...prev].slice(0, 10));
    setForm({ title: "", description: "", imageUrl: "" });
  };

  const handleClaim = (reward) => {
    setSelectedReward(reward);
  };

  const handleDeleteReward = (rewardId) => {
    setRewards((prev) => prev.filter((reward) => reward.id !== rewardId));
    setClaimedRewardIds((prev) => prev.filter((id) => id !== rewardId));
    if (selectedReward && selectedReward.id === rewardId) {
      setSelectedReward(null);
    }
  };

  const confirmClaim = (rewardId) => {
    setClaimedRewardIds((prev) => {
      if (prev.includes(rewardId)) {
        return prev;
      }
      return [...prev, rewardId];
    });
    setSelectedReward(null);
  };

  return (
    <MainLayout>
      <div className="prize-page-shell">
        <div className="prize-page-header">
          <div>
            <p className="prize-eyebrow">Ladder reward</p>
            <h1>Trang phần thưởng</h1>
          </div>
          <div className="prize-progress-chip">
            <Trophy size={16} />
            {lessonCount} bài học
          </div>
        </div>

        <div className="prize-summary-card">
          <div>
            <span>Tiến độ hiện tại</span>
            <strong>
              {Math.floor(lessonCount / 5)} / 5 mốc
            </strong>
          </div>
          <div>
            <span>Bài học tiếp theo</span>
            <strong>{nextThreshold} bài nữa</strong>
          </div>
          <div>
            <span>Phần thưởng</span>
            <strong>{Math.floor(lessonCount / 5)} giải thưởng</strong>
          </div>
        </div>

        <div className="prize-layout">
          <div className="prize-list-panel">
            <div className="panel-header">
              <Gift size={18} />
              <span>Ladder prize</span>
            </div>

            <div className="prize-ladder">
              {ladderRewards.map((item) => (
                <div
                  key={item.id}
                  className={`prize-card ${item.unlocked ? "is-unlocked" : "is-locked"}`}
                >
                  <div className="reward-tier-head">
                    <div className="reward-tier-icon-wrap">
                      <div className="reward-tier-icon">
                        {item.unlocked ? <Star size={18} /> : <Zap size={18} />}
                      </div>
                      <span className="reward-tier-index">{item.threshold / 5}</span>
                    </div>

                    <div className="reward-tier-name-block">
                      <small>{item.unlocked ? "Unlocked" : "Locked"}</small>
                      <strong>{item.title}</strong>
                    </div>

                    <div className="prize-card-actions">
                      <button
                        type="button"
                        className="reward-delete-button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteReward(item.id);
                        }}
                        aria-label="Xoá phần thưởng"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="prize-media">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} />
                    ) : (
                      <div className="text-placeholder">
                        <ImageIcon size={26} />
                        <span>Text only</span>
                      </div>
                    )}
                  </div>

                  <div className="prize-card-body">
                    <div className="reward-meta-row">
                      <span className="reward-slab">{item.threshold} lessons</span>
                      {item.unlocked && <Sparkles size={15} />}
                    </div>
                    <p>{item.description}</p>
                    <small>{item.unlocked ? "Đã mở khóa" : `Cần ${item.threshold} bài học`}</small>
                  </div>

                  <button
                    type="button"
                    className="claim-button"
                    disabled={!item.unlocked || item.claimed}
                    onClick={() => handleClaim(item)}
                  >
                    {item.claimed ? "Đã nhận" : "Claim Prize"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="reward-form-panel">
            <div className="panel-header">
              <Trophy size={18} />
              <span>Thêm phần thưởng</span>
            </div>

            <form className="reward-form" onSubmit={handleSubmit}>
              <label className="field-group">
                <span>Tên phần thưởng</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  placeholder="Ví dụ: Gift code 500k"
                />
              </label>

              <label className="field-group">
                <span>Mô tả</span>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  rows="4"
                  placeholder="Nhập mô tả thưởng bằng text"
                />
              </label>

              <label className="field-group">
                <span>Link ảnh phần thưởng</span>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, imageUrl: event.target.value }))
                  }
                  placeholder="https://..."
                />
              </label>

              <button type="submit" className="submit-prize-button">
                Thêm phần thưởng
              </button>
            </form>
          </div>
        </div>
      </div>

      {selectedReward && (
        <div className="prize-modal-backdrop" onClick={() => setSelectedReward(null)}>
          <div className="prize-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setSelectedReward(null)}
            >
              <X size={18} />
            </button>

            <div className="modal-body">
              <h2>{selectedReward.title}</h2>

              {selectedReward.imageUrl ? (
                <img src={selectedReward.imageUrl} alt={selectedReward.title} />
              ) : (
                <div className="modal-text-box">{selectedReward.description}</div>
              )}

              <p>{selectedReward.description}</p>

              {!selectedReward.claimed && (
                <button
                  type="button"
                  className="modal-claim-button"
                  onClick={() => confirmClaim(selectedReward.id)}
                >
                  Nhận thưởng
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default PrizePage;
