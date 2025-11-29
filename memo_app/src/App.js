import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import MemoModal from "./components/MemoModal";
import MemoList from "./components/MemoList";

function App() {
  const [memos, setMemos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // 로컬 스토리지에서 메모 불러오기
  useEffect(() => {
    const savedMemos = localStorage.getItem("memos");
    if (savedMemos) {
      setMemos(JSON.parse(savedMemos));
    }
  }, []);

  // 메모 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    if (memos.length > 0) {
      localStorage.setItem("memos", JSON.stringify(memos));
    } else {
      localStorage.removeItem("memos");
    }
  }, [memos]);

  // 새 메모 작성 모드 시작
  const handleAddMemo = () => {
    setIsCreatingNew(true);
    setEditingId("new");
    setEditContent("");
  };

  // 메모 수정 모드 시작
  const handleEditMemo = (memo) => {
    setIsCreatingNew(false);
    setEditingId(memo.id);
    setEditContent(memo.content);
  };

  // 메모 저장
  const handleSaveMemo = () => {
    if (isCreatingNew) {
      // 새 메모 추가
      const newMemo = {
        id: Date.now(),
        content: editContent,
        createdAt: new Date().toISOString(),
      };
      setMemos([newMemo, ...memos]);
      setIsCreatingNew(false);
      setEditingId(null);
      setEditContent("");
    } else if (editingId) {
      // 기존 메모 수정
      setMemos(
        memos.map((memo) =>
          memo.id === editingId
            ? {
                ...memo,
                content: editContent,
                updatedAt: new Date().toISOString(),
              }
            : memo
        )
      );
      setEditingId(null);
      setEditContent("");
    }
  };

  // 취소
  const handleCancel = () => {
    setIsCreatingNew(false);
    setEditingId(null);
    setEditContent("");
  };

  // 메모 삭제
  const handleDeleteMemo = (id) => {
    if (window.confirm("이 메모를 삭제하시겠습니까?")) {
      setMemos(memos.filter((memo) => memo.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setEditContent("");
      }
    }
  };

  // 검색 필터링
  const filteredMemos = memos.filter((memo) =>
    memo.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <Header />

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddMemo={handleAddMemo}
      />

      <MemoModal
        isOpen={isCreatingNew}
        content={editContent}
        onChange={setEditContent}
        onSave={handleSaveMemo}
        onCancel={handleCancel}
      />

      <MemoList
        memos={filteredMemos}
        searchTerm={searchTerm}
        editingId={editingId}
        editContent={editContent}
        onEdit={handleEditMemo}
        onSave={handleSaveMemo}
        onCancel={handleCancel}
        onDelete={handleDeleteMemo}
        onEditContentChange={setEditContent}
      />
    </div>
  );
}

export default App;
