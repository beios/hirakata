import React from 'react';
import '../styles/CharacterList.css';

const CharacterList = ({ characters, type }) => {
    return (
        <div className="character-list">
            <h2>{type} 문자 목록</h2>
            <div className="character-grid">
                {characters.map((char, index) => (
                    <div key={index} className="character-item">
                        <div className="character">{char}</div>
                        <div className="pronunciation">{getPronunciation(char)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const getPronunciation = (character) => {
    const pronunciations = {
        あ: '아', い: '이', う: '우', え: '에', お: '오',
        か: '카', き: '키', く: '쿠', け: '케', こ: '코',
        さ: '사', し: '시', す: '스', せ: '세', そ: '소',
        た: '타', ち: '치', つ: '츠', て: '테', と: '토',
        な: '나', に: '니', ぬ: '누', ね: '네', の: '노',
        は: '하', ひ: '히', ふ: '후', へ: '헤', ほ: '호',
        ま: '마', み: '미', む: '무', め: '메', も: '모',
        や: '야', ゆ: '유', よ: '요',
        ら: '라', り: '리', る: '루', れ: '레', ろ: '로',
        わ: '와', を: '오', ん: '응',
        ア: '아', イ: '이', ウ: '우', エ: '에', オ: '오',
        カ: '카', キ: '키', ク: '쿠', ケ: '케', コ: '코',
        サ: '사', シ: '시', ス: '스', セ: '세', ソ: '소',
        タ: '타', チ: '치', ツ: '츠', テ: '테', ト: '토',
        ナ: '나', ニ: '니', ヌ: '누', ネ: '네', ノ: '노',
        ハ: '하', ヒ: '히', フ: '후', ヘ: '헤', ホ: '호',
        マ: '마', ミ: '미', ム: '무', メ: '메', モ: '모',
        ヤ: '야', ユ: '유', ヨ: '요',
        ラ: '라', リ: '리', ル: '루', レ: '레', ロ: '로',
        ワ: '와', ヲ: '오', ン: '응'
    };
    return pronunciations[character] || '';
};

export default CharacterList; 