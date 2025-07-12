import React, { useContext, useState } from 'react';
import { AppContext } from './StateCenter';
import { addToUserVocab, removeFromUserVocab } from './CommunicationCenter';
// should I add/remove words one by one, or wait some time and batch them?
// I could add some debounce.

function WordAdder({ words }: { words: string[] }) {
    const { state, setState } = useContext(AppContext)
    const [ stringInput, setStringInput ] = useState('');

    async function addWord(word: string) {
        if( state.user.username && word) {
            const words = word.split(/[, .]+/).map(w => w.trim().toLowerCase()).filter(w => w !== '');
            addToUserVocab(state.serverAddress, state.user.username, words);
            setState((prevState) => ({
                ...prevState,
                user: {
                    ...prevState.user,
                    vocabulary: [...prevState.user.vocabulary, ...words]
                }
            }));
        }
    }

    async function handleCheckboxChange(word: string, checked: boolean) {
        if (checked && state.user.username) {
            addToUserVocab(state.serverAddress, state.user.username, [word.toLowerCase()])
        }
        else if (state.user.username) {
            removeFromUserVocab(state.serverAddress, state.user.username, [word.toLowerCase()])
        }
        setState((prevState) => {
            const newVocabulary = checked
                ? [...prevState.user.vocabulary, word.toLowerCase()]
                : prevState.user.vocabulary.filter((w) => w !== word.toLowerCase() && w !== word);

            return {
                ...prevState,
                user: {
                    ...prevState.user,
                    vocabulary: newVocabulary
                }
            };
        })
    }

    return (
        <div>
            <h2>Add Words to Vocabulary</h2>
            <div>
                <input onChange={(e) => setStringInput(e.target.value)}/>
                <button onClick={() => addWord(stringInput)}>Add Word</button>
            </div>
            <ul>
                {words.map((word, index) => (
                    <li key={index}>
                        {word}
                        <input
                            type='checkbox'
                            checked={state.user.vocabulary.includes(word)}
                            onChange={(e) => { handleCheckboxChange(word, e.target.checked) }}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default WordAdder;