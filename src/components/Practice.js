import React, { useState } from 'react';
import '../styles/Practice.css';

function Practice({ characters, currentIndex, onNext, onPrev, onRandomize }) {
  const [showPronunciation, setShowPronunciation] = useState(false);
  const currentCharacter = characters[currentIndex];

  if (!currentCharacter) {
    return <div className="practice-container">Loading character data...</div>;
  }

  return (
    <div className="practice-container">
      <div className="character-display" onClick={() => setShowPronunciation(!showPronunciation)}>
        <div className="japanese-character">{currentCharacter.character}</div>
        {showPronunciation && (
          <div className="pronunciation">{currentCharacter.pronunciation}</div>
        )}
      </div>
      <div className="controls">
        <div className="navigation-buttons">
          <button onClick={onPrev}>Previous</button>
          <button onClick={onNext}>Next</button>
        </div>
        <button className="randomize-button" onClick={onRandomize}>
          Randomize Order
        </button>
      </div>
      <div className="progress-info">
        {currentIndex + 1} / {characters.length}
      </div>
    </div>
  );
}

export default Practice; 