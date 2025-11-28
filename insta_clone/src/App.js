import React from "react";
import "./App.css";
import Header from "./components/Header";
import Stories from "./components/Stories";
import Post from "./components/Post";
import Sidebar from "./components/Sidebar";
import { feedData } from "./data/feedData";

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <div className="feed-container">
          <Stories />
          <div className="posts">
            {feedData.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        </div>
        <Sidebar />
      </main>
    </div>
  );
}

export default App;
