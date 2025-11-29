import React from "react";
import MemoEditor from "./MemoEditor";

function MemoCard({
  memo,
  isEditing,
  editContent,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onEditContentChange,
}) {
  return (
    <div className={`memo-card ${isEditing ? "editing" : ""}`}>
      {isEditing ? (
        <MemoEditor
          content={editContent}
          onChange={onEditContentChange}
          onSave={onSave}
          onCancel={onCancel}
          onDelete={() => onDelete(memo.id)}
          showDelete={true}
        />
      ) : (
        <>
          <div className="memo-content">{memo.content || "(빈 메모)"}</div>
          <div className="memo-date">
            {new Date(memo.updatedAt || memo.createdAt).toLocaleString("ko-KR")}
          </div>
          <div className="memo-actions">
            <button className="btn btn-secondary" onClick={() => onEdit(memo)}>
              수정
            </button>
            <button
              className="btn btn-danger"
              onClick={() => onDelete(memo.id)}
            >
              삭제
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MemoCard;
