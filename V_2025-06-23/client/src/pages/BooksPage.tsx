import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../components/StateCenter';
import { getBooks } from '../components/CommunicationCenter';

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
                                    <td style={cellStyles}>?</td> {/* Placeholder */}
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </>
    )
}

export default BooksPage