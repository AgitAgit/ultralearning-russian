// src/components/PdfToServerConverter.jsx
import React, { useState, useCallback } from 'react';

const serverAddress = 'http://localhost:3000'

const PdfToServerConverter = () => {
    const [pdfText, setPdfText] = useState('');
    const [wordList, setWordList] = useState(null);
    const [fileName, setFileName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const sendPdfToServer = async (file) => {
        setIsProcessing(true);
        setError(null);
        setPdfText(''); // Clear previous text
        setFileName(file.name);

        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('pdfFile', file); // 'pdfFile' must match the field name in multer: upload.single('pdfFile')

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
            console.log(result)
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
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <p>Drag & Drop your PDF file here, or</p>
                <input
                    id="file-upload-server" // Unique ID
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }} // Hide the actual input
                />
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
                        return <div key={object.word} style={{color:"black"}}>{object.word}:{object.count}</div>
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