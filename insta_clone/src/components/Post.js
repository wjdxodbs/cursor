import React, { useState } from 'react';

function Post({ post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <article className="post">
      <div className="post-header">
        <div className="post-user">
          <img src={post.profilePic} alt={post.username} className="post-avatar" />
          <span className="post-username">{post.username}</span>
        </div>
        <button className="post-options">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="2"></circle>
            <circle cx="12" cy="12" r="2"></circle>
            <circle cx="12" cy="19" r="2"></circle>
          </svg>
        </button>
      </div>

      <div className="post-image">
        <img src={post.image} alt="post" />
      </div>

      <div className="post-actions">
        <div className="post-actions-left">
          <button className={`action-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill={liked ? 'red' : 'none'} stroke={liked ? 'red' : 'currentColor'} strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <button className="action-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
          <button className="action-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
            </svg>
          </button>
        </div>
        <button className={`action-btn ${saved ? 'saved' : ''}`} onClick={() => setSaved(!saved)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>

      <div className="post-info">
        <p className="post-likes">좋아요 {likes.toLocaleString()}개</p>
        <p className="post-caption">
          <strong>{post.username}</strong> {post.caption}
        </p>
        <p className="post-comments">댓글 45개 모두 보기</p>
        <p className="post-time">{post.time}</p>
      </div>

      <div className="post-comment">
        <input type="text" placeholder="댓글 달기..." />
        <button className="comment-btn">게시</button>
      </div>
    </article>
  );
}

export default Post;

