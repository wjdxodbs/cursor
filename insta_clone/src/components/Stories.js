import React, { useRef, useState } from "react";

const storyData = [
  { id: 1, username: "내 스토리", profilePic: "/man.png" },
  { id: 2, username: "김지수", profilePic: "/woman.png" },
  { id: 3, username: "이민호", profilePic: "/man.png" },
  { id: 4, username: "박서연", profilePic: "/woman.png" },
  { id: 5, username: "최준호", profilePic: "/man.png" },
  { id: 6, username: "정수민", profilePic: "/woman.png" },
  { id: 7, username: "강태희", profilePic: "/man.png" },
  { id: 8, username: "윤하늘", profilePic: "/woman.png" },
];

function Stories() {
  const storiesRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - storiesRef.current.offsetLeft);
    setScrollLeft(storiesRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - storiesRef.current.offsetLeft;
    const walk = (x - startX) * 2; // 스크롤 속도 조절
    storiesRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="stories-container">
      <div
        className={`stories ${isDragging ? "dragging" : ""}`}
        ref={storiesRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {storyData.map((story) => (
          <div key={story.id} className="story">
            <div className="story-avatar">
              <img src={story.profilePic} alt={story.username} />
            </div>
            <span className="story-username">{story.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stories;
