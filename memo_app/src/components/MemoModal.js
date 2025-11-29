import React from "react";
import MemoEditor from "./MemoEditor";

function MemoModal({ isOpen, content, onChange, onSave, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="memo-card editing">
          <MemoEditor
            content={content}
            onChange={onChange}
            onSave={onSave}
            onCancel={onCancel}
            showDelete={false}
          />
        </div>
      </div>
    </div>
  );
}

export default MemoModal;
