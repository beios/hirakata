import React, { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import { syncData, loadSyncedData } from './services/syncService';
import './App.css';
import Practice from './components/Practice';
import List from './components/List';
import Quiz from './components/Quiz';
import QuizHistory from './components/QuizHistory';
import Auth from './components/Auth';
import { hiraganaSet, katakanaSet } from './data/characters';

function App() {
    const [mode, setMode] = useState('practice');
    const [selectedTypes, setSelectedTypes] = useState(['hiragana', 'katakana']);
    const [characters, setCharacters] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quizType, setQuizType] = useState(null);
    const [user, setUser] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);

    const savePracticeState = useCallback(async (chars, index) => {
        const state = {
            characters: chars,
            currentIndex: index,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('practiceState', JSON.stringify(state));
        
        if (user) {
            await syncData(user.uid);
        }
    }, [user]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                setIsSyncing(true);
                await loadSyncedData(user.uid);
                setIsSyncing(false);

                // 5분마다 자동 동기화
                const syncInterval = setInterval(async () => {
                    await syncData(user.uid);
                }, 5 * 60 * 1000);

                return () => clearInterval(syncInterval);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        let combinedCharacters = [];
        if (selectedTypes.includes('hiragana')) {
            combinedCharacters = [...combinedCharacters, ...hiraganaSet];
        }
        if (selectedTypes.includes('katakana')) {
            combinedCharacters = [...combinedCharacters, ...katakanaSet];
        }
        
        if (mode === 'practice') {
            const savedPractice = localStorage.getItem('practiceState');
            if (savedPractice) {
                const { characters: savedChars, currentIndex: savedIndex } = JSON.parse(savedPractice);
                const savedTypes = savedChars.every(char => 
                    (selectedTypes.includes('hiragana') && hiraganaSet.some(h => h.character === char.character)) ||
                    (selectedTypes.includes('katakana') && katakanaSet.some(k => k.character === char.character))
                );
                
                if (savedTypes && savedChars.length === combinedCharacters.length) {
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
    }, [mode, selectedTypes, savePracticeState]);

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
                <div className="header-top">
                    <h1>Hirakata</h1>
                    <Auth user={user} />
                </div>
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
                {isSyncing ? (
                    <div className="sync-indicator">데이터 동기화 중...</div>
                ) : (
                    renderContent()
                )}
            </main>
        </div>
    );
}

export default App;
