import React, { useState, useEffect } from 'react';
import '../styles/Quiz.css';

function Quiz({ characters, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [options, setOptions] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    useEffect(() => {
        generateOptions();
    }, [currentIndex]);

    const generateOptions = () => {
        const currentChar = characters[currentIndex];
        const otherChars = characters.filter(char => char !== currentChar);
        const shuffledOthers = [...otherChars].sort(() => Math.random() - 0.5).slice(0, 4);
        const allOptions = [currentChar, ...shuffledOthers].sort(() => Math.random() - 0.5);
        setOptions(allOptions);
        setSelectedAnswer(null);
        setShowFeedback(false);
    };

    const handleAnswerSelect = (option) => {
        if (showFeedback) return;
        
        setSelectedAnswer(option);
        setShowFeedback(true);

        if (option.pronunciation === characters[currentIndex].pronunciation) {
            setScore(prev => prev + 1);
        }

        setTimeout(() => {
            if (currentIndex < characters.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                const result = {
                    date: new Date().toISOString(),
                    score,
                    total: characters.length,
                    percentage: Math.round((score / characters.length) * 100)
                };

                const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
                history.push(result);
                localStorage.setItem('quizHistory', JSON.stringify(history));

                onComplete();
            }
        }, 1000);
    };

    return (
        <div className="quiz-container">
            <div className="progress-bar">
                문제 {currentIndex + 1} / {characters.length}
            </div>
            <div className="question">
                <h2>다음 문자의 발음을 선택하세요:</h2>
                <div className="character-display">
                    {characters[currentIndex].character}
                </div>
            </div>
            <div className="options-grid">
                {options.map((option, index) => (
                    <button
                        key={index}
                        className={`option-button ${
                            selectedAnswer === option
                                ? option.pronunciation === characters[currentIndex].pronunciation
                                    ? 'correct'
                                    : 'incorrect'
                                : ''
                        }`}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={showFeedback}
                    >
                        {option.pronunciation}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Quiz; 