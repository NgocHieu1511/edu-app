import { useState } from "react";
import { Plus, Minus, RotateCcw } from "lucide-react";
import "../assets/css/BT1.css";
function MyCoursesPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="counter-card">
        <h1>Counter</h1>

        <div className="count-display">{count}</div>

        <div className="button-group">
          <button className="counter-btn" onClick={() => setCount(count - 1)}>
            <Minus size={20} />
            <span>Giảm</span>
          </button>

          <button className="counter-btn reset-btn" onClick={() => setCount(0)}>
            <RotateCcw size={20} />
            <span>Reset</span>
          </button>

          <button className="counter-btn" onClick={() => setCount(count + 1)}>
            <Plus size={20} />
            <span>Tăng</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyCoursesPage;
