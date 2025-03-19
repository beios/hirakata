import React, { useState, useEffect } from 'react';
import './styles/QuizHistory.css';

const QuizHistory = () => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        const quizResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
        setResults(quizResults);
    }, []);

    const clearHistory = () => {
        localStorage.removeItem('quizResults');
        setResults([]);
    };

    return (
        <div className="quiz-history">
            <h2>학습 기록</h2>
            {results.length === 0 ? (
                <p>아직 학습 기록이 없습니다.</p>
            ) : (
                <>
                    <button onClick={clearHistory} className="clear-button">
                        기록 삭제
                    </button>
                    <div className="results-list">
                        {results.map((result, index) => (
                            <div key={index} className="result-item">
                                <div className="result-type">{result.type}</div>
                                <div className="result-score">점수: {result.score}/10</div>
                                <div className="result-date">
                                    {new Date(result.date).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default QuizHistory; 