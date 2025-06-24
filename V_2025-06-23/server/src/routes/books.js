const express = require("express");
const multer = require('multer');
const {
    addBook,
    getAllBooks
} = require("../controllers/booksController")
const { pdfToString } = require('../functions/fileConversions')
const router = express.Router();
const upload = multer({ dest: '../../assets/uploads' })


router.get("/", getAllBooks)

router.post("/", addBook)

router.post("/convert-pdf", upload.single('pdfFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No PDF file uploaded.' });
    }

    const filePath = req.file.path;

    try {
        const extractedText = await pdfToString(filePath);
        res.json({ text: extractedText });
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