const Book = require("../models/Book.js");

async function getAllBooks(req, res, next) {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    next(error);
  }
}

// async function addBook(req, res, next) {
//   try {
//     const { title, wordList, author, language } = req.body;
//     const book = new Book({
//       title,
//       wordList,
//       author,
//       language
//     });
//     const result = await book.save();
//     res.status(201).json(result);
//   } catch (error) {
//     next(error);
//   }
// }

async function addBook(title, wordList, author, language) {
  try {
    const book = new Book({
      title,
      wordList,
      author,
      language
    });
    const result = await book.save();
    return result;
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
    addBook,
    getAllBooks
};