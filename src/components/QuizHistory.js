import React, { useState, useEffect } from 'react';
import '../styles/QuizHistory.css';
import { auth } from '../firebase/config';
import { syncData, loadSyncedData } from '../services/syncService';

const QuizHistory = () => {
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    
    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-US');
    };

    const handleRecordClick = (index) => {
        setSelectedRecord(selectedRecord === index ? null : index);
    };

    const handleClearHistory = async () => {
        if (window.confirm('Are you sure you want to delete all quiz records?\nThis action cannot be undone.')) {
            localStorage.removeItem('quizResults');
            if (auth.currentUser) {
                await syncData(auth.currentUser.uid);
            }
            window.location.reload();
        }
    };

    // 컴포넌트 마운트 시 데이터 동기화
    useEffect(() => {
        const syncHistory = async () => {
            if (auth.currentUser) {
                setIsSyncing(true);
                await loadSyncedData(auth.currentUser.uid);
                setIsSyncing(false);
            }
        };
        syncHistory();
    }, []);

    const quizResults = JSON.parse(localStorage.getItem('quizResults') || '[]');

    return (
        <div className="history-container">
            <div className="history-header">
                <h2>Quiz History</h2>
                <div className="header-buttons">
                    {isSyncing && <span className="sync-indicator">동기화 중...</span>}
                    {quizResults.length > 0 && (
                        <button className="clear-history-button" onClick={handleClearHistory}>
                            Clear History
                        </button>
                    )}
                </div>
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
                            
                            {selectedRecord === index && (
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