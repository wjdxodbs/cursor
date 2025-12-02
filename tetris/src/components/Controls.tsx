import React from "react";

export const Controls: React.FC = () => {
  return (
    <div className="controls-panel">
      <h3 className="panel-title">CONTROLS</h3>
      <div className="controls-list">
        <div className="control-item">
          <span className="control-key">←/→</span>
          <span className="control-action">Move</span>
        </div>
        <div className="control-item">
          <span className="control-key">↓</span>
          <span className="control-action">Soft Drop</span>
        </div>
        <div className="control-item">
          <span className="control-key">SPACE</span>
          <span className="control-action">Hard Drop</span>
        </div>
        <div className="control-item">
          <span className="control-key">↑/X</span>
          <span className="control-action">Rotate CW</span>
        </div>
        <div className="control-item">
          <span className="control-key">Z</span>
          <span className="control-action">Rotate CCW</span>
        </div>
        <div className="control-item">
          <span className="control-key">C/Shift</span>
          <span className="control-action">Hold</span>
        </div>
        <div className="control-item">
          <span className="control-key">P/ESC</span>
          <span className="control-action">Pause</span>
        </div>
        <div className="control-item">
          <span className="control-key">R</span>
          <span className="control-action">Restart</span>
        </div>
      </div>
    </div>
  );
};
