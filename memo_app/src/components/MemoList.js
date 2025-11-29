import React from "react";
import MemoCard from "./MemoCard";

function MemoList({
  memos,
  searchTerm,
  editingId,
  editContent,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onEditContentChange,
}) {
  if (memos.length === 0) {
    return (
      <div className="memos-container">
        <div className="empty-state">
          {searchTerm
            ? "검색 결과가 없습니다."
            : "메모가 없습니다. 새 메모를 추가해보세요!"}
        </div>
      </div>
    );
  }

  return (
    <div className="memos-container">
      {memos.map((memo) => (
        <MemoCard
          key={memo.id}
          memo={memo}
          isEditing={editingId === memo.id}
          editContent={editContent}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onDelete={onDelete}
          onEditContentChange={onEditContentChange}
        />
      ))}
    </div>
  );
}

export default MemoList;
