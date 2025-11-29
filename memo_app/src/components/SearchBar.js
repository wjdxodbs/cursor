import React from "react";

function SearchBar({ searchTerm, onSearchChange, onAddMemo }) {
  return (
    <div className="controls">
      <button className="btn btn-primary" onClick={onAddMemo}>
        새 메모
      </button>
      <div className="search-box">
        <input
          type="text"
          placeholder="검색..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export default SearchBar;
