import React, { useState, useEffect } from 'react';
import { hiragana } from './data/hiragana';
import { katakana } from './data/katakana';
import { useSwipeable } from 'react-swipeable';
import CharacterDisplay from './components/CharacterDisplay';
import './styles/App.css';

const App = () => {
    const [startY, setStartY] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentSet, setCurrentSet] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState(['Hiragana', 'Katakana']);
    const [showPronunciation, setShowPronunciation] = useState(false);

    // Update the character set whenever selectedTypes changes
    useEffect(() => {
        const updatedSet = generateRandomSet();
        setCurrentSet(updatedSet);
        setCurrentIndex(0);
    }, [selectedTypes]);

    // Generate a random set based on selected types
    function generateRandomSet() {
        let combinedSet = [];
        if (selectedTypes.includes('Hiragana')) combinedSet = [...combinedSet, ...hiragana];
        if (selectedTypes.includes('Katakana')) combinedSet = [...combinedSet, ...katakana];
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

    const toggleTypeSelection = (type) => {
        if (selectedTypes.length === 1 && selectedTypes.includes(type)) {
            return; // Prevent deselecting the last remaining type
        }

        setSelectedTypes((prevTypes) =>
            prevTypes.includes(type)
                ? prevTypes.filter((t) => t !== type) // Remove type if selected
                : [...prevTypes, type] // Add type if not selected
        );
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

    const currentCharacter = currentSet[currentIndex];

    return (
        <div {...swipeHandlers} className="app">
            {/* Type Selection Buttons */}
            <div className="type-selection">
                <button
                    className={`type-button ${selectedTypes.includes('Hiragana') ? 'active' : ''}`}
                    onClick={() => toggleTypeSelection('Hiragana')}
                >
                    Hiragana
                </button>
                <button
                    className={`type-button ${selectedTypes.includes('Katakana') ? 'active' : ''}`}
                    onClick={() => toggleTypeSelection('Katakana')}
                >
                    Katakana
                </button>
            </div>
            <CharacterDisplay character={currentCharacter} showPronunciation={showPronunciation} />
        </div>
    );
};

export default App;
