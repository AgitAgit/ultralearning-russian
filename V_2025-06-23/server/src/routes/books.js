const express = require("express");
const multer = require('multer');
const fs = require('fs');

const {
    addBook,
    getAllBooks,
    getBooks
} = require("../controllers/booksController")
const { pdfToString } = require('../functions/fileConversions')
const { stringToWordList } = require('../functions/stringManipulation')
const router = express.Router();
const upload = multer({ dest: '../../assets/uploads' })


// router.get("/", getAllBooks)

router.get("/", async (req, res) => {
    const { limit, offset, language, author, title } = req.query;
    try {
        const books = await getBooks(
            parseInt(limit) || 10,
            parseInt(offset) || 0,
            language || null,
            author || null,
            title || null
        );
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Error fetching books', error: error.message });
    }
})



// router.post("/", addBook)

router.post("/convert-pdf", upload.single('pdfFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No PDF file uploaded.' });
    }

    const {title, author, language} = req.body
    // console.log(title, author, language);
    const filePath = req.file.path;

    try {
        const extractedText = await pdfToString(filePath);
        const wordList = stringToWordList(extractedText);
        const result = await addBook(title, wordList, author, language)
        // console.log(result)
        res.json({result})
    } catch (error) {
        console.error('Error processing PDF on server:', error);
        res.status(500).json({ message: 'Error converting PDF to text', error: error.message });
    } finally {
        // Clean up: delete the temporary file after processing
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting temporary file:', err);
            });
        }
    }
})

module.exports = router;