import { useContext, useEffect } from "react";
import { AppContext } from "../components/StateCenter";
import { type AppState } from "../components/StateCenter";

export interface Book {
    title: string;
    author: string;
    language: string;
    wordList: Array<{word: string, count: number}>;
}

const SingleBookPage = () => {
    const { state, setState }: { state: AppState, setState: (state: AppState) => void } = useContext(AppContext)
    const book = state.currentBook

    return (
        <>
            <button onClick={() => setState({...state, currentPage: "books"})}>Back</button>
            <h1>Single Book Page</h1>
            {book && (
                <div>
                    <h2>{book.title}</h2>
                    <h3>{book.author}</h3>
                    <h4>{book.language}</h4>
                    <ul>
                        {book.wordList.map((wordObj, index) => (
                            <li key={index}>
                                {wordObj.word} (count: {wordObj.count})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    )
}

export default SingleBookPage;