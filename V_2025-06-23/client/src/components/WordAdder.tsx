import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from './StateCenter';
import { addToUserVocab, removeFromUserVocab } from './CommunicationCenter';
import { RussianCommon100 } from './wordPacks/Russian_common_100';
// should I add/remove words one by one, or wait some time and batch them?
// I could add some debounce.
export type wordPack = {
    title: string;
    words: string[];
}
function WordAdder({ wordPacks }: { wordPacks: wordPack[] }) {
    const { state, setState } = useContext(AppContext)
    const [ stringInput, setStringInput ] = useState('');
    const [openAccordion, setOpenAccordion] = useState<number | null>(null);
    const [wordPacksDisplay, setWordPacksDisplay] = useState<wordPack[]>(wordPacks);
    
    // useEffect(() => {
    //     setWordPacksDisplay([...wordPacks, RussianCommon100]);
    // }, []);
    
    async function addWord(word: string) {
        if( state.user.username && word) {
            const words = word.split(/[, .]+/).map(w => w.trim().toLowerCase()).filter(w => w !== '');
            addToUserVocab(state.serverAddress, state.user.username, words);
            setState((prevState: any) => ({
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
        setState((prevState: any) => {
            const newVocabulary = checked
                ? [...prevState.user.vocabulary, word.toLowerCase()]
                : prevState.user.vocabulary.filter((w: string) => w !== word.toLowerCase() && w !== word);

            return {
                ...prevState,
                user: {
                    ...prevState.user,
                    vocabulary: newVocabulary
                }
            };
        })
    }

    // Helper to split array into n columns
    function splitIntoColumns<T>(arr: T[], numCols: number): T[][] {
        const cols: T[][] = Array.from({ length: numCols }, () => []);
        arr.forEach((item, idx) => {
            cols[idx % numCols].push(item);
        });
        return cols;
    }

    return (
        <div>
            <h2>Add Words to Vocabulary</h2>
            <div>
                <input onChange={(e) => setStringInput(e.target.value)}/>
                <button onClick={() => addWord(stringInput)}>Add Word</button>
            </div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {wordPacksDisplay.map((pack, packIndex) => (
                    <li key={packIndex} style={{ marginBottom: '1em', border: '1px solid #ccc', borderRadius: '4px' }}>
                        <div
                            style={{ cursor: 'pointer', padding: '0.5em', background: '#f5f5f5', fontWeight: 'bold' }}
                            onClick={() => setOpenAccordion(openAccordion === packIndex ? null : packIndex)}
                        >
                            {pack.title}
                        </div>
                        {openAccordion === packIndex && (
                            <div style={{ padding: '1em', display: 'flex', gap: '1em' }}>
                                {splitIntoColumns(pack.words, 3).map((col, colIdx) => (
                                    <ul key={colIdx} style={{ flex: 1, listStyle: 'none', padding: 0 }}>
                                        {col.map((word, wordIndex) => (
                                            <li key={wordIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5em' }}>
                                                {word}
                                                <input
                                                    type='checkbox'
                                                    checked={state.user.vocabulary.includes(word)}
                                                    onChange={(e) => { handleCheckboxChange(word, e.target.checked) }}
                                                    style={{ marginLeft: '0.5em' }}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                ))}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default WordAdder;