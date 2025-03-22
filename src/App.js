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
            // Load saved practice state or create new one
            const savedPractice = localStorage.getItem('practiceState');
            if (savedPractice) {
                const { characters: savedChars, currentIndex: savedIndex, lastUpdated } = JSON.parse(savedPractice);
                // Check if the saved state matches current character types
                const savedTypes = savedChars.every(char => 
                    (selectedTypes.includes('hiragana') && hiraganaSet.some(h => h.character === char.character)) ||
                    (selectedTypes.includes('katakana') && katakanaSet.some(k => k.character === char.character))
                );
                
                if (savedTypes) {
                    setCharacters(savedChars);
                    setCurrentIndex(savedIndex);
                } else {
                    const randomizedChars = [...combinedCharacters].sort(() => Math.random() - 0.5);
                    setCharacters(randomizedChars);
                    setCurrentIndex(0);
                    savePracticeState(randomizedChars, 0);
                }
            } else {
                const randomizedChars = [...combinedCharacters].sort(() => Math.random() - 0.5);
                setCharacters(randomizedChars);
                setCurrentIndex(0);
                savePracticeState(randomizedChars, 0);
            }
        } else {
            setCharacters(combinedCharacters);
            setCurrentIndex(0);
        }
    }, [mode, selectedTypes]);

    const savePracticeState = (chars, index) => {
        localStorage.setItem('practiceState', JSON.stringify({
            characters: chars,
            currentIndex: index,
            lastUpdated: new Date().toISOString()
        }));
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        setQuizType(null);
    };

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % characters.length;
        setCurrentIndex(nextIndex);
        if (mode === 'practice') {
            savePracticeState(characters, nextIndex);
        }
    };

    const handlePrev = () => {
        const prevIndex = (currentIndex - 1 + characters.length) % characters.length;
        setCurrentIndex(prevIndex);
        if (mode === 'practice') {
            savePracticeState(characters, prevIndex);
        }
    };

    const handleRandomize = () => {
        const randomizedChars = [...characters].sort(() => Math.random() - 0.5);
        setCharacters(randomizedChars);
        setCurrentIndex(0);
        savePracticeState(randomizedChars, 0);
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
        setMode('history');
        setQuizType(null);
    };

    const renderContent = () => {
        switch (mode) {
            case 'practice':
                return (
                    <Practice
                        characters={characters}
                        currentIndex={currentIndex}
                        onNext={handleNext}
                        onPrev={handlePrev}
                        onRandomize={handleRandomize}
                    />
                );
            case 'list':
                return <List characters={characters} />;
            case 'quiz':
                if (!quizType) {
                    return (
                        <div className="quiz-type-selection">
                            <h2>Select Quiz Type</h2>
                            <div className="quiz-type-buttons">
                                <button onClick={() => startQuiz('hiragana')}>Hiragana Quiz</button>
                                <button onClick={() => startQuiz('katakana')}>Katakana Quiz</button>
                            </div>
                        </div>
                    );
                }
                return (
                    <Quiz
                        characters={[...characters].sort(() => Math.random() - 0.5).slice(0, 10)}
                        onComplete={handleQuizComplete}
                        quizType={quizType}
                    />
                );
            case 'history':
                return <QuizHistory />;
            default:
                return null;
        }
    };

    return (
        <div className="app">
            <header className="app-header">
                <h1>Hirakata</h1>
                <div className="character-type-selection">
                    <button
                        className={selectedTypes.includes('hiragana') ? 'active' : ''}
                        onClick={() => toggleCharacterType('hiragana')}
                    >
                        Hiragana
                    </button>
                    <button
                        className={selectedTypes.includes('katakana') ? 'active' : ''}
                        onClick={() => toggleCharacterType('katakana')}
                    >
                        Katakana
                    </button>
                </div>
                <nav>
                    <button
                        className={mode === 'practice' ? 'active' : ''}
                        onClick={() => handleModeChange('practice')}
                    >
                        Practice
                    </button>
                    <button
                        className={mode === 'list' ? 'active' : ''}
                        onClick={() => handleModeChange('list')}
                    >
                        List
                    </button>
                    <button
                        className={mode === 'quiz' ? 'active' : ''}
                        onClick={() => handleModeChange('quiz')}
                    >
                        Quiz
                    </button>
                    <button
                        className={mode === 'history' ? 'active' : ''}
                        onClick={() => handleModeChange('history')}
                    >
                        History
                    </button>
                </nav>
            </header>
            <main className="app-main">
                {renderContent()}
            </main>
        </div>
    );
}

export default App;
