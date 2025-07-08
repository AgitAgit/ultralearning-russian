// src/components/PdfToServerConverter.jsx
import React, { useState, useCallback, useContext } from 'react';
import { AppContext } from './StateCenter'; 

// bookmark last here 2025/07/08 validation fails because the book title is not passed
// correctly or something like that
// Gemini says: The most likely reason why the title, author, and language fields are not being recognized by your server is due to how Multer processes the incoming multipart/form-data request.
const PdfToServerConverter = () => {
    const { state, setState } = useContext(AppContext);
    const serverAddress = state.serverAddress || 'http://localhost:3000'
    const [pdfText, setPdfText] = useState('');
    const [wordList, setWordList] = useState(null);
    const [fileName, setFileName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [language, setLanguage] = useState('russian');


    const sendPdfToServer = async (file) => {
        setIsProcessing(true);
        setError(null);
        setPdfText(''); // Clear previous text
        setFileName(file.name);

        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('pdfFile', file); // 'pdfFile' must match the field name in multer: upload.single('pdfFile')
        formData.append('title', title)
        formData.append('author', author)
        formData.append('language', language)

        try {
            const response = await fetch(`${serverAddress}/books/convert-pdf`, {
                method: 'POST',
                body: formData, // No Content-Type header needed for FormData; browser sets it
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            // console.log(result)
            setPdfText(result.text);
            setWordList(result.wordList);
        } catch (err) {
            console.error('Error sending PDF to server:', err);
            setError(err.message || 'Failed to send PDF to server.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDrop = useCallback((event) => {
        event.preventDefault();
        setIsDragOver(false); // Reset drag-over state
        const files = event.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'application/pdf') {
            sendPdfToServer(files[0]);
        } else {
            setError('Please drop a PDF file.');
        }
    }, []);

    const handleDragOver = useCallback((event) => {
        event.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragOver(false);
    }, []);

    const handleFileInputChange = (event) => {
        const files = event.target.files;
        if (files.length > 0 && files[0].type === 'application/pdf') {
            sendPdfToServer(files[0]);
        } else {
            setError('Please select a PDF file.');
        }
    };

    return (
        <div style={styles.container}>
            <h2>PDF to Text Server Converter</h2>

            <div
                style={{
                    ...styles.dropZone,
                    borderColor: isDragOver ? '#007bff' : '#ccc',
                    backgroundColor: isDragOver ? '#e6f7ff' : '#f9f9f9',
                    color: "black"
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <label>title: </label>
                <input name='title' onChange={(e) => setTitle(e.target.value)} />
                <br></br>
                <label>author: </label>
                <input name='author' onChange={(e) => setAuthor(e.target.value)} />
                <br></br>
                <label>language: </label>
                <select onChange={(e) => setLanguage(e.target.value)}>
                    <option value={"russian"}>russian</option>
                    <option value={"english"}>english</option>
                    <option value={"hebrew"}>hebrew</option>
                </select>
                <br></br>
                <input
                    id="file-upload-server" // Unique ID
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }} // Hide the actual input
                />
                <p>Drag & Drop your PDF file here, or</p>
                <label htmlFor="file-upload-server" style={styles.fileInputLabel}>
                    Choose a PDF File
                </label>
            </div>

            {isProcessing && <p style={styles.message}>Processing "{fileName}" on server... This may take a moment.</p>}
            {error && <p style={styles.error}>Error: {error}</p>}

            {pdfText && (
                <div style={styles.resultContainer}>
                    <h3>Extracted Text from "{fileName}":</h3>
                    <textarea
                        style={styles.textarea}
                        value={pdfText}
                        readOnly
                        rows="15"
                        cols="80"
                    ></textarea>
                </div>
            )}
            {wordList && (
                <div>
                    oppp
                    {wordList.map((object) => {
                        return <div key={object.word} style={{ color: "black" }}>{object.word}:{object.count}</div>
                    })}
                </div>
            )}
        </div>
    );
};

// Re-using the same styles from the previous example,
// but you might want to create a separate CSS file for them.
const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '40px auto',
        padding: '20px',
        border: '1px solid #eee',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
    },
    dropZone: {
        border: '2px dashed #ccc',
        borderRadius: '5px',
        padding: '40px 20px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.3s ease, background-color 0.3s ease',
        marginBottom: '20px',
    },
    fileInput: {
        display: 'none', // Hide the default file input
    },
    fileInputLabel: {
        display: 'inline-block',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '15px',
        fontSize: '1em',
        fontWeight: 'bold',
    },
    message: {
        color: '#007bff',
        fontWeight: 'bold',
        marginTop: '15px',
    },
    error: {
        color: '#dc3545',
        fontWeight: 'bold',
        marginTop: '15px',
    },
    resultContainer: {
        marginTop: '30px',
        borderTop: '1px solid #eee',
        paddingTop: '20px',
    },
    textarea: {
        width: '100%',
        minHeight: '250px',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '0.9em',
        lineHeight: '1.4',
        resize: 'vertical',
        boxSizing: 'border-box', // Include padding in width
    },
};

export default PdfToServerConverter;