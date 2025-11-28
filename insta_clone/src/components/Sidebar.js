import React from "react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <img src="/man.png" alt="프로필" className="sidebar-avatar" />
        <div className="sidebar-user-info">
          <strong>your_username</strong>
          <span>당신의 이름</span>
        </div>
        <button className="switch-btn">전환</button>
      </div>
      <div className="suggestions">
        <div className="suggestions-header">
          <span>회원님을 위한 추천</span>
          <button>모두 보기</button>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="suggestion-item">
            <img src={i % 2 === 0 ? "/woman.png" : "/man.png"} alt="추천" />
            <div className="suggestion-info">
              <strong>user_{i}</strong>
              <span>회원님을 위한 추천</span>
            </div>
            <button className="follow-btn">팔로우</button>
          </div>
        ))}
      </div>
      <footer className="footer-links">
        <a href="#">소개</a> · <a href="#">도움말</a> ·{" "}
        <a href="#">홍보 센터</a> ·<a href="#">API</a> ·{" "}
        <a href="#">채용 정보</a> · <a href="#">개인정보처리방침</a> ·
        <a href="#">약관</a> · <a href="#">위치</a> · <a href="#">언어</a>
        <p>© 2025 INSTAGRAM FROM META</p>
      </footer>
    </aside>
  );
}

export default Sidebar;
