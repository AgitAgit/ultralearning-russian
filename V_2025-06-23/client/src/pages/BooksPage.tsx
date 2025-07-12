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

// last here 2025/07/09 need to deal with fetching book percentages without creating an infinite loop.
// maybe separate the percentage array from the books array, then create a third, composite derived state
// from the both of them and use that for the display
const BooksPage = () => {
    const { state, setState } = useContext(AppContext)
    const [books, setBooks] = useState(null)
    const [uniqueKnownPercent, setUniqueKnownPercent] = useState(null)
    const [booksWithPercentage, setBooksWithPercentage] = useState(null)

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
                const newBooksPromiseResults = await Promise.allSettled(books.map(async (book) => {
                    if (state.user && state.user.username) {
                        const data = await getBookPercent(state.serverAddress, state.user.username, book.title, book.author, book.language)
                        book.uniqueKnownPercent = data.knownPercent;
                        return book
                    }
                }))
                const newBooks = newBooksPromiseResults.filter((promise) => promise.status === "fulfilled").map((promise) => {return promise.value})
                // console.log("newBooks",newBooks)
                setBooksWithPercentage(newBooks)
            }
        }
        fetchData();
    }, [books])

    return (
        <>
            <table style={tableStyles}>
                <thead>
                    <tr>
                        <th style={headerStyles}>title</th>
                        <th style={headerStyles}>author</th>
                        <th style={headerStyles}>language</th>
                        <th style={headerStyles}>unique known words percentage</th>
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
                                    <td style={cellStyles}>{book.knownPercent || "?"}</td> {/* Placeholder */}
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
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </>
    )
}

export default BooksPage