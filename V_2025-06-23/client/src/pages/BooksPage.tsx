import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../components/StateCenter';
import { getBooks, getBookPercent } from '../components/CommunicationCenter';

const tableStyles = {
    width: '100%',
    borderCollapse: 'collapse', // Note camelCase for CSS properties
    marginBottom: '1em',
};

const cellStyles = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
};

const headerStyles = {
    ...cellStyles, // Inherit base cell styles
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
};

const spinnerStyle = {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid #f3f3f3',
    borderTop: '2px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '8px',
};

// last here 2025/07/09 need to deal with fetching book percentages without creating an infinite loop.
// maybe separate the percentage array from the books array, then create a third, composite derived state
// from the both of them and use that for the display
const BooksPage = () => {
    const { state, setState } = useContext(AppContext)
    const [books, setBooks] = useState(null)
    const [uniqueKnownPercent, setUniqueKnownPercent] = useState(null)
    const [booksWithPercentage, setBooksWithPercentage] = useState(null)
    const [isLoadingPercentages, setIsLoadingPercentages] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const data = await getBooks(state.serverAddress)
            // console.log(data)
            setBooks(data)
        }
        fetchData();
    }, [state.user.username])

    useEffect(() => {
        const fetchData = async () => {
            if (books) {
                setIsLoadingPercentages(true)
                const newBooksPromiseResults = await Promise.allSettled(books.map(async (book) => {
                    if (state.user && state.user.username) {
                        const data = await getBookPercent(state.serverAddress, state.user.username, book.title, book.author, book.language)
                        book.uniqueKnownPercent = data.knownPercent;
                        return book
                    }
                }))
                const newBooks = newBooksPromiseResults.filter((promise) => promise.status === "fulfilled").map((promise) => {return promise.value})
                console.log("newBooks",newBooks)
                setBooksWithPercentage(newBooks)
                setIsLoadingPercentages(false)
            }
        }
        fetchData();
    }, [books])

    const renderPercentageCell = (book) => {
        if (isLoadingPercentages) {
            return (
                <td style={cellStyles}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={spinnerStyle}></div>
                        Loading...
                    </div>
                </td>
            );
        }
        
        if (book.uniqueKnownPercent === null || book.uniqueKnownPercent === undefined) {
            return <td style={cellStyles}>?</td>;
        }
        
        return <td style={cellStyles}>{book.uniqueKnownPercent}</td>;
    };

    return (
        <>
            <div>
                <button>refresh</button>
            </div>
            <table style={tableStyles}>
                <thead>
                    <tr>
                        <th style={headerStyles}>title</th>
                        <th style={headerStyles}>author</th>
                        <th style={headerStyles}>language</th>
                        <th style={headerStyles}>unique known words percentage</th>
                        <th style={headerStyles}>unique words in book</th>
                    </tr>
                </thead>
                <tbody>
                    {books && !booksWithPercentage &&
                        books.map((book, index) => {
                            // Apply conditional background for zebra stripping
                            const rowBackgroundColor = index % 2 === 0 ? '#f9f9f9' : 'white'; // Even rows lighter grey
                            const rowStyles = {
                                backgroundColor: rowBackgroundColor,
                                // You could add a hover effect with state if purely inline,
                                // but CSS classes are more common and performant for :hover.
                                // For example: onMouseEnter, onMouseLeave to toggle a state and apply style.
                            };

                            return (
                                <tr key={book.title} style={rowStyles}>
                                    <td style={cellStyles}>{book.title}</td>
                                    <td style={cellStyles}>{book.author}</td>
                                    <td style={cellStyles}>{book.language}</td>
                                    {renderPercentageCell(book)}
                                    <td style={cellStyles}>{book.wordList.length}</td>
                                </tr>
                            );
                        })}
                </tbody>
                <tbody>
                    {booksWithPercentage &&
                        booksWithPercentage.map((book, index) => {
                            // Apply conditional background for zebra stripping
                            const rowBackgroundColor = index % 2 === 0 ? '#f9f9f9' : 'white'; // Even rows lighter grey
                            const rowStyles = {
                                backgroundColor: rowBackgroundColor,
                                // You could add a hover effect with state if purely inline,
                                // but CSS classes are more common and performant for :hover.
                                // For example: onMouseEnter, onMouseLeave to toggle a state and apply style.
                            };

                            return (
                                <tr key={book.title} style={rowStyles}>
                                    <td style={cellStyles}>{book.title}</td>
                                    <td style={cellStyles}>{book.author}</td>
                                    <td style={cellStyles}>{book.language}</td>
                                    <td style={cellStyles}>{book.uniqueKnownPercent === null || book.uniqueKnownPercent === undefined ? "?" : book.uniqueKnownPercent}</td>
                                    <td style={cellStyles}>{book.wordList.length}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </>
    )
}

export default BooksPage