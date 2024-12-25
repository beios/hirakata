import React from 'react';

const ProgressBar = ({ currentType }) => {
    return (
        <div className="progress-bar">
      <span className={`set-name ${currentType === 'Hiragana' ? 'active' : ''}`}>
        {currentType === 'Hiragana' ? 'Hiragana' : 'Katakana'}
      </span>
        </div>
    );
};

export default ProgressBar;
