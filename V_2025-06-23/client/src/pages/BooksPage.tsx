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

    useEffect(() => {
        const fetchData = async () => {
            const data = await getBooks(state.serverAddress)
            console.log(data)
            setBooks(data)
        }
        fetchData();
    }, [])

    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (books && books[0] && state.user.username) {
    //             books.forEach(async (book) => {
    //                 const response = await getBookPercent(state.serverAddress, state.user.username, book.title, book.author, book.language)
    //                 console.log(response)
    //                 // book["uniqueKnownPercentage"] = response.knownPercent;
    //                 // Update the state using setBooks
    //                 setBooks(prevBooks => {
    //                     // Map over the previous books array
    //                     return prevBooks.map(b => {
    //                         // If this is the book we're currently processing, create a new object
    //                         // with the added uniqueKnownPercentage property
    //                         if (b.title === book.title && b.author === book.author && b.language === book.language) {
    //                             return {
    //                                 ...b, // Copy all existing properties
    //                                 uniqueKnownPercentage: response.knownPercent // Add the new property
    //                             };
    //                         }
    //                         // Otherwise, return the book unchanged
    //                         return b;
    //                     });
    //                 });
    //             })
    //             // setBooks(prev => prev)
    //         }
    //     }
    //     fetchData();
    //     if (books && books[0] && books[0]["uniqueKnownPercentage"]) {
    //         console.log("test", books[0]["uniqueKnownPercentage"])
    //     }
    // }, [books, state.user.username])

    useEffect(() => {
        const fetchDataAndCalculatePercentages = async () => {
            // Ensure books and username are available
            if (!books || books.length === 0 || !state.user.username) {
                return; // Exit if conditions not met
            }

            // Create a new array to store updated books
            const updatedBooks = await Promise.all(
                books.map(async (book) => {
                    try {
                        const response = await getBookPercent(
                            state.serverAddress,
                            state.user.username,
                            book.title,
                            book.author,
                            book.language
                        );
                        console.log(response);
                        return {
                            ...book,
                            uniqueKnownPercentage: response.knownPercent,
                        };
                    } catch (error) {
                        console.error("Error fetching percentage for book:", book.title, error);
                        return { ...book, uniqueKnownPercentage: null }; // Handle errors gracefully
                    }
                })
            );

            // Update the state once with the new array
            setBooks(updatedBooks);
        };

        fetchDataAndCalculatePercentages();

    }, [state.user.username]);

    return (
        <>
            This is the books page
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
                    {books &&
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
            </table>
        </>
    )
}

export default BooksPage