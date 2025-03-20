import React, { useState, useEffect } from 'react';
import '../styles/Quiz.css';

function Quiz({ characters, onComplete, quizType }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [options, setOptions] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [quizHistory, setQuizHistory] = useState([]);

    useEffect(() => {
        generateOptions();
    }, [currentIndex, characters]);

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

        const isCorrect = option.pronunciation === characters[currentIndex].pronunciation;
        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        setQuizHistory(prev => [...prev, {
            question: characters[currentIndex].character,
            selectedAnswer: option.pronunciation,
            correctAnswer: characters[currentIndex].pronunciation,
            isCorrect,
        }]);

        setTimeout(() => {
            if (currentIndex < characters.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                const result = {
                    timestamp: new Date().toISOString(),
                    score,
                    quizType: quizType.charAt(0).toUpperCase() + quizType.slice(1),
                    details: [...quizHistory, {
                        question: characters[currentIndex].character,
                        selectedAnswer: option.pronunciation,
                        correctAnswer: characters[currentIndex].pronunciation,
                        isCorrect,
                    }]
                };

                const history = JSON.parse(localStorage.getItem('quizResults') || '[]');
                const updatedHistory = [result, ...history].slice(0, 100);
                localStorage.setItem('quizResults', JSON.stringify(updatedHistory));

                onComplete();
            }
        }, 1000);
    };

    return (
        <div className="quiz-container">
            <div className="progress-bar">
                Question {currentIndex + 1} / {characters.length}
            </div>
            <div className="question">
                <h2>Select the pronunciation for this character:</h2>
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