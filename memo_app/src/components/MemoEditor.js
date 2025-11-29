import React from "react";

function MemoEditor({
  content,
  onChange,
  onSave,
  onCancel,
  onDelete,
  showDelete = false,
}) {
  return (
    <>
      <textarea
        className="memo-textarea"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="메모 내용을 입력하세요..."
        autoFocus
      />
      <div className="memo-actions">
        <button className="btn btn-success" onClick={onSave}>
          저장
        </button>
        <button className="btn btn-secondary" onClick={onCancel}>
          취소
        </button>
        {showDelete && (
          <button className="btn btn-danger" onClick={onDelete}>
            삭제
          </button>
        )}
      </div>
    </>
  );
}

export default MemoEditor;
