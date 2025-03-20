import React from 'react';
import '../styles/List.css';

function List({ characters }) {
  return (
    <div className="list-container">
      <div className="character-grid">
        {characters.map((char, index) => (
          <div key={index} className="character-card">
            <div className="japanese-character">{char.character}</div>
            <div className="list-pronunciation">{char.pronunciation}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default List; 