import React, { useState, useEffect } from 'react';
import { hiragana } from './data/hiragana';
import { katakana } from './data/katakana';
import { useSwipeable } from 'react-swipeable';
import CharacterDisplay from './components/CharacterDisplay';
import CharacterList from './components/CharacterList';
import Quiz from './components/Quiz';
import QuizHistory from './components/QuizHistory';
import './styles/App.css';

const App = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentSet, setCurrentSet] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState(['Hiragana', 'Katakana']);
    const [showPronunciation, setShowPronunciation] = useState(false);
    const [mode, setMode] = useState('practice'); // 'practice', 'list', 'quiz', 'history'
    const [quizType, setQuizType] = useState(null);

    useEffect(() => {
        const updatedSet = generateRandomSet();
        setCurrentSet(updatedSet);
        setCurrentIndex(0);
    }, [selectedTypes]);

    function generateRandomSet() {
        let combinedSet = [];
        if (selectedTypes.includes('Hiragana')) combinedSet = [...combinedSet, ...hiragana];
        if (selectedTypes.includes('Katakana')) combinedSet = [...combinedSet, ...katakana];
        return shuffleArray(combinedSet);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const toggleTypeSelection = (type) => {
        if (selectedTypes.includes(type)) {
            if (selectedTypes.length > 1) {
                setSelectedTypes((prevTypes) => prevTypes.filter((t) => t !== type));
            }
        } else {
            setSelectedTypes((prevTypes) => [...prevTypes, type]);
        }
    };

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => {
            const nextIndex = (currentIndex + 1) % currentSet.length;
            setCurrentIndex(nextIndex);
        },
        onSwipedRight: () => {
            const prevIndex = (currentIndex - 1 + currentSet.length) % currentSet.length;
            setCurrentIndex(prevIndex);
        },
        onSwipedUp: () => setShowPronunciation(true),
        onSwipedDown: () => setShowPronunciation(false),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    const startQuiz = (type) => {
        setQuizType(type);
        setMode('quiz');
    };

    const handleQuizComplete = () => {
        setMode('practice');
        setQuizType(null);
    };

    const renderContent = () => {
        switch (mode) {
            case 'list':
                return (
                    <div className="list-container">
                        {selectedTypes.includes('Hiragana') && (
                            <CharacterList characters={hiragana} type="히라가나" />
                        )}
                        {selectedTypes.includes('Katakana') && (
                            <CharacterList characters={katakana} type="가타카나" />
                        )}
                    </div>
                );
            case 'quiz':
                const quizSet = quizType === 'Hiragana' ? hiragana : katakana;
                return (
                    <Quiz
                        characters={shuffleArray([...quizSet]).slice(0, 10)}
                        type={quizType}
                        onComplete={handleQuizComplete}
                    />
                );
            case 'history':
                return <QuizHistory />;
            default:
                return (
                    <div {...swipeHandlers} className="practice-container">
                        <CharacterDisplay
                            character={currentSet[currentIndex]}
                            showPronunciation={showPronunciation}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="app">
            <div className="type-selection">
                <button
                    className={`type-button ${selectedTypes.includes('Hiragana') ? 'active' : ''}`}
                    onClick={() => toggleTypeSelection('Hiragana')}
                >
                    히라가나
                </button>
                <button
                    className={`type-button ${selectedTypes.includes('Katakana') ? 'active' : ''}`}
                    onClick={() => toggleTypeSelection('Katakana')}
                >
                    가타카나
                </button>
            </div>

            <div className="mode-selection">
                <button
                    className={`mode-button ${mode === 'practice' ? 'active' : ''}`}
                    onClick={() => setMode('practice')}
                >
                    연습
                </button>
                <button
                    className={`mode-button ${mode === 'list' ? 'active' : ''}`}
                    onClick={() => setMode('list')}
                >
                    목록
                </button>
                <button
                    className={`mode-button ${mode === 'quiz' ? 'active' : ''}`}
                    onClick={() => setMode('quiz')}
                >
                    퀴즈
                </button>
                <button
                    className={`mode-button ${mode === 'history' ? 'active' : ''}`}
                    onClick={() => setMode('history')}
                >
                    기록
                </button>
            </div>

            {mode === 'quiz' && !quizType && (
                <div className="quiz-type-selection">
                    <h2>퀴즈 타입 선택</h2>
                    <button onClick={() => startQuiz('Hiragana')}>히라가나 퀴즈</button>
                    <button onClick={() => startQuiz('Katakana')}>가타카나 퀴즈</button>
                </div>
            )}

            {renderContent()}
        </div>
    );
};

export default App;
