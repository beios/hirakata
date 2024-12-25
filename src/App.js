import React, { useState, useEffect } from 'react';
import { hiragana } from './data/hiragana';
import { katakana } from './data/katakana';
import { useSwipeable } from 'react-swipeable';
import CharacterDisplay from './components/CharacterDisplay';
import ProgressBar from './components/ProgressBar';
import './styles/App.css';

const App = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentSet, setCurrentSet] = useState(generateRandomSet());
    const [currentType, setCurrentType] = useState(null); // Track if current character is Hiragana or Katakana
    const [showPronunciation, setShowPronunciation] = useState(false);

    // Generate a random set combining both Hiragana and Katakana
    function generateRandomSet() {
        const combinedSet = [...hiragana, ...katakana];
        return shuffleArray(combinedSet);
    }

    // Shuffle the array to randomize the character order
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Update the current set and type of character (Hiragana or Katakana)
    const updateCurrentCharacter = (index) => {
        const character = currentSet[index];
        setCurrentIndex(index);

        // Determine if the character is from Hiragana or Katakana
        if (hiragana.includes(character)) {
            setCurrentType('Hiragana');
        } else {
            setCurrentType('Katakana');
        }
    };

    // Initial type setup on the first render
    useEffect(() => {
        // Set the type of the first character in the shuffled set
        const firstCharacter = currentSet[0];
        if (hiragana.includes(firstCharacter)) {
            setCurrentType('Hiragana');
        } else {
            setCurrentType('Katakana');
        }
    }, [currentSet]);

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => {
            const nextIndex = (currentIndex + 1) % currentSet.length;
            updateCurrentCharacter(nextIndex);
        },
        onSwipedRight: () => {
            const prevIndex = (currentIndex - 1 + currentSet.length) % currentSet.length;
            updateCurrentCharacter(prevIndex);
        },
        onSwipedUp: () => setShowPronunciation(true),
        onSwipedDown: () => setShowPronunciation(false),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    const currentCharacter = currentSet[currentIndex];

    return (
        <div {...swipeHandlers} className="app">
            {/* ProgressBar */}
            <ProgressBar currentType={currentType} />
            <CharacterDisplay character={currentCharacter} showPronunciation={showPronunciation} />
        </div>
    );
};

export default App;
