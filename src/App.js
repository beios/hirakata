import React, { useState, useEffect } from 'react';
import './App.css';
import Practice from './components/Practice';
import List from './components/List';
import Quiz from './components/Quiz';
import QuizHistory from './components/QuizHistory';
import { hiraganaSet, katakanaSet } from './data/characters';

function App() {
    const [mode, setMode] = useState('practice');
    const [selectedTypes, setSelectedTypes] = useState(['hiragana', 'katakana']);
    const [characters, setCharacters] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showHistory, setShowHistory] = useState(false);
    const [quizType, setQuizType] = useState(null);

    useEffect(() => {
        let combinedCharacters = [];
        if (selectedTypes.includes('hiragana')) {
            combinedCharacters = [...combinedCharacters, ...hiraganaSet];
        }
        if (selectedTypes.includes('katakana')) {
            combinedCharacters = [...combinedCharacters, ...katakanaSet];
        }
        
        if (mode === 'practice') {
            setCharacters([...combinedCharacters].sort(() => Math.random() - 0.5));
        } else {
            setCharacters(combinedCharacters);
        }
        setCurrentIndex(0);
    }, [mode, selectedTypes]);

    const handleModeChange = (newMode) => {
        setMode(newMode);
        setShowHistory(false);
        setQuizType(null);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % characters.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + characters.length) % characters.length);
    };

    const toggleCharacterType = (type) => {
        setSelectedTypes(prev => {
            if (prev.includes(type)) {
                if (prev.length > 1) {
                    return prev.filter(t => t !== type);
                }
                return prev;
            }
            return [...prev, type];
        });
    };

    const startQuiz = (type) => {
        setQuizType(type);
        setMode('quiz');
        setCharacters(type === 'hiragana' ? hiraganaSet : katakanaSet);
    };

    const handleQuizComplete = () => {
        setMode('practice');
        setQuizType(null);
    };

    const renderContent = () => {
        if (showHistory) {
            return <QuizHistory onClose={() => setShowHistory(false)} />;
        }

        switch (mode) {
            case 'practice':
                return (
                    <Practice
                        characters={characters}
                        currentIndex={currentIndex}
                        onNext={handleNext}
                        onPrev={handlePrev}
                    />
                );
            case 'list':
                return <List characters={characters} />;
            case 'quiz':
                if (!quizType) {
                    return (
                        <div className="quiz-type-selection">
                            <h2>퀴즈 유형 선택</h2>
                            <div className="quiz-type-buttons">
                                <button onClick={() => startQuiz('hiragana')}>히라가나 퀴즈</button>
                                <button onClick={() => startQuiz('katakana')}>가타카나 퀴즈</button>
                            </div>
                        </div>
                    );
                }
                return (
                    <Quiz
                        characters={[...characters].sort(() => Math.random() - 0.5).slice(0, 10)}
                        onComplete={handleQuizComplete}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="app">
            <header className="app-header">
                <h1>히라가타</h1>
                <div className="character-type-selection">
                    <button
                        className={selectedTypes.includes('hiragana') ? 'active' : ''}
                        onClick={() => toggleCharacterType('hiragana')}
                    >
                        히라가나
                    </button>
                    <button
                        className={selectedTypes.includes('katakana') ? 'active' : ''}
                        onClick={() => toggleCharacterType('katakana')}
                    >
                        가타카나
                    </button>
                </div>
                <nav>
                    <button
                        className={mode === 'practice' ? 'active' : ''}
                        onClick={() => handleModeChange('practice')}
                    >
                        연습
                    </button>
                    <button
                        className={mode === 'list' ? 'active' : ''}
                        onClick={() => handleModeChange('list')}
                    >
                        목록
                    </button>
                    <button
                        className={mode === 'quiz' ? 'active' : ''}
                        onClick={() => handleModeChange('quiz')}
                    >
                        퀴즈
                    </button>
                    <button onClick={() => setShowHistory(true)}>기록</button>
                </nav>
            </header>
            <main className="app-main">
                {renderContent()}
            </main>
        </div>
    );
}

export default App;
