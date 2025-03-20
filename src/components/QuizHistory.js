import React from 'react';
import '../styles/QuizHistory.css';

function QuizHistory({ onClose }) {
    const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    return (
        <div className="history-container">
            <h2>퀴즈 기록</h2>
            {history.length === 0 ? (
                <p>아직 퀴즈 기록이 없습니다.</p>
            ) : (
                <div className="history-list">
                    {history.map((result, index) => (
                        <div key={index} className="history-item">
                            <div className="history-date">{formatDate(result.date)}</div>
                            <div className="history-score">
                                점수: {result.score}/{result.total} ({result.percentage}%)
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <button onClick={onClose} className="close-button">
                닫기
            </button>
        </div>
    );
}

export default QuizHistory; 