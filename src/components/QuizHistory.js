import React, { useState } from 'react';
import '../styles/QuizHistory.css';

const QuizHistory = () => {
    const [selectedRecord, setSelectedRecord] = useState(null);
    
    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-US');
    };

    const handleRecordClick = (index) => {
        setSelectedRecord(selectedRecord === index ? null : index);
    };

    const handleClearHistory = () => {
        if (window.confirm('Are you sure you want to delete all quiz records?\nThis action cannot be undone.')) {
            localStorage.removeItem('quizResults');
            window.location.reload();
        }
    };

    const quizResults = JSON.parse(localStorage.getItem('quizResults') || '[]');

    return (
        <div className="history-container">
            <div className="history-header">
                <h2>Quiz History</h2>
                {quizResults.length > 0 && (
                    <button className="clear-history-button" onClick={handleClearHistory}>
                        Clear History
                    </button>
                )}
            </div>
            {quizResults.length === 0 ? (
                <p className="no-history">No quiz records yet.</p>
            ) : (
                <ul className="history-list">
                    {quizResults.map((result, index) => (
                        <li key={result.timestamp} className="history-item">
                            <div 
                                className="history-summary" 
                                onClick={() => handleRecordClick(index)}
                            >
                                <span className="history-date">{formatDate(result.timestamp)}</span>
                                <span className="history-score">
                                    Score: {result.score}/10 ({(result.score * 10)}%)
                                </span>
                                <span className="history-type">{result.quizType}</span>
                            </div>
                            {selectedRecord === index && result.details && (
                                <div className="history-details">
                                    {result.details.map((detail, qIndex) => (
                                        <div 
                                            key={qIndex} 
                                            className={`question-result ${detail.isCorrect ? 'correct' : 'incorrect'}`}
                                        >
                                            <div className="question-char">{detail.question}</div>
                                            <div className="answer-info">
                                                <span>Selected: {detail.selectedAnswer}</span>
                                                {!detail.isCorrect && (
                                                    <span className="correct-answer">Correct: {detail.correctAnswer}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default QuizHistory; 