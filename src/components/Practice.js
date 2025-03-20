import React, { useState } from 'react';
import '../styles/Practice.css';

function Practice({ characters, currentIndex, onNext, onPrev }) {
  const [showPronunciation, setShowPronunciation] = useState(false);
  const currentCharacter = characters[currentIndex];

  if (!currentCharacter) {
    return <div className="practice-container">문자 데이터를 불러오는 중...</div>;
  }

  return (
    <div className="practice-container">
      <div className="character-display" onClick={() => setShowPronunciation(!showPronunciation)}>
        <div className="japanese-character">{currentCharacter.character}</div>
        {showPronunciation && (
          <div className="pronunciation">{currentCharacter.pronunciation}</div>
        )}
      </div>
      <div className="navigation-buttons">
        <button onClick={onPrev}>이전</button>
        <button onClick={onNext}>다음</button>
      </div>
      <div className="progress-info">
        {currentIndex + 1} / {characters.length}
      </div>
    </div>
  );
}

export default Practice; 