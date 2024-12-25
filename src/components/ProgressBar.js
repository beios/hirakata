import React from 'react';

const ProgressBar = ({ currentType }) => {
    return (
        <div className="progress-bar">
      <span className={`set-name ${currentType === 'Hiragana' ? 'active' : ''}`}>
        {currentType === 'Hiragana' ? 'Hiragana' : ''}
      </span>
      <span className={`set-name ${currentType === 'Katakana' ? 'active' : ''}`}>
        {currentType === 'Katakana' ? 'Katakana' : ''}
      </span>
        </div>
    );
};

export default ProgressBar;
