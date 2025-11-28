import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [memos, setMemos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // 로컬 스토리지에서 메모 불러오기
  useEffect(() => {
    const savedMemos = localStorage.getItem('memos');
    if (savedMemos) {
      setMemos(JSON.parse(savedMemos));
    }
  }, []);

  // 메모 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    if (memos.length > 0) {
      localStorage.setItem('memos', JSON.stringify(memos));
    } else {
      localStorage.removeItem('memos');
    }
  }, [memos]);

  // 새 메모 작성 모드 시작
  const handleAddMemo = () => {
    setIsCreatingNew(true);
    setEditingId('new');
    setEditContent('');
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
      setEditContent('');
    } else if (editingId) {
      // 기존 메모 수정
      setMemos(memos.map(memo => 
        memo.id === editingId 
          ? { ...memo, content: editContent, updatedAt: new Date().toISOString() }
          : memo
      ));
      setEditingId(null);
      setEditContent('');
    }
  };

  // 취소
  const handleCancel = () => {
    setIsCreatingNew(false);
    setEditingId(null);
    setEditContent('');
  };

  // 메모 삭제
  const handleDeleteMemo = (id) => {
    if (window.confirm('이 메모를 삭제하시겠습니까?')) {
      setMemos(memos.filter(memo => memo.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setEditContent('');
      }
    }
  };

  // 검색 필터링
  const filteredMemos = memos.filter(memo =>
    memo.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <header className="app-header">
        <h1>메모</h1>
      </header>

      <div className="controls">
        <button className="btn btn-primary" onClick={handleAddMemo}>
          새 메모
        </button>
        <div className="search-box">
          <input
            type="text"
            placeholder="검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 새 메모 작성 모달 */}
      {isCreatingNew && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="memo-card editing">
              <textarea
                className="memo-textarea"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="메모 내용을 입력하세요..."
                autoFocus
              />
              <div className="memo-actions">
                <button className="btn btn-success" onClick={handleSaveMemo}>
                  저장
                </button>
                <button className="btn btn-secondary" onClick={handleCancel}>
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="memos-container">
        {/* 메모가 없을 때 표시 */}
        {filteredMemos.length === 0 && (
          <div className="empty-state">
            {searchTerm ? '검색 결과가 없습니다.' : '메모가 없습니다. 새 메모를 추가해보세요!'}
          </div>
        )}

        {/* 기존 메모 목록 */}
        {filteredMemos.map(memo => (
            <div key={memo.id} className={`memo-card ${editingId === memo.id ? 'editing' : ''}`}>
              {editingId === memo.id ? (
                <>
                  <textarea
                    className="memo-textarea"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="메모 내용을 입력하세요..."
                    autoFocus
                  />
                  <div className="memo-actions">
                    <button className="btn btn-success" onClick={handleSaveMemo}>
                      저장
                    </button>
                    <button className="btn btn-secondary" onClick={handleCancel}>
                      취소
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteMemo(memo.id)}>
                      삭제
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="memo-content">
                    {memo.content || '(빈 메모)'}
                  </div>
                  <div className="memo-date">
                    {new Date(memo.updatedAt || memo.createdAt).toLocaleString('ko-KR')}
                  </div>
                  <div className="memo-actions">
                    <button className="btn btn-secondary" onClick={() => handleEditMemo(memo)}>
                      수정
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteMemo(memo.id)}>
                      삭제
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
