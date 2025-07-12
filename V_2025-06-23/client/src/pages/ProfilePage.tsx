import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../components/StateCenter';
import { getUserVocab } from '../components/CommunicationCenter';
import WordAdder from '../components/WordAdder';
import { RussianCommon100 } from '../components/wordPacks/Russian_common_100';

const ProfilePage = () => {
    const { state, setState } = useContext(AppContext)
    const vocab = (state.user.vocabulary || []).filter(word => {
        if (state.currentTargetLanguage === "russian") {
            return /[а-яА-ЯёЁ]/.test(word);
        } else if (state.currentTargetLanguage === "english") {
            return /^[a-zA-Z]+$/.test(word);
        }
        return true;
    });
    const yourVocabularyHeading = `Your ${state.currentTargetLanguage} Vocabulary`;
    return (
        <>
            <WordAdder wordPacks={[{title:"pack1", words:["да","нет","не"]},{title:"pack2", words:["как","нет"]}, RussianCommon100]} />
            <div>
                <h2>{yourVocabularyHeading}</h2>
                {vocab.length > 0 ? (
                    <ul>
                        {vocab.map((word, index) => (
                            <li key={index}>{word}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No vocabulary words found.</p>
                )}
            </div>
        </>
    )
}

export default ProfilePage