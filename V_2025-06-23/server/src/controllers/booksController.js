const Book = require("../models/Book.js");

async function getAllBooks(req, res, next) {
  try {
    const books = await Book.find().lean();
    //Temp section start for testing
    const booksWithUniqueWordCount = books.map(book => {
      console.log(book)
      book["uniqueWordCount"] = book.wordList.length
      return book;
    })
    res.json(booksWithUniqueWordCount);
    //Temp section end
    // res.json(books);
  } catch (error) {
    next(error);
  }
}

async function getBooks(limit = 10, offset = 0, language = null, author = null, title = null) {
  const query = {};
  if (language) {
    query.language = language;
  }
  if (author) {
    query.author = { $regex: author, $options: 'i' };
  }
  if (title) {
    query.title = { $regex: title, $options: 'i' }
  }
  const options = {
    limit: limit,
    skip: offset,
    sort: { createdAt: -1 } // Sort by creation date, descending
  };
  try {
    const books = await Book.find(query, null, options).lean();
    return books
  } catch (error) {
    console.log(error)
    throw new Error(error);
  }
}

async function getSingleBook(title, author, language) {
  try {
    const book = await Book.findOne({ title, author, language })
    return book;
  } catch (error) {
    console.log(error)
    throw new Error(error);
  }
}

async function getCleanWordList(title, author, language) {
  try {
    const book = await getSingleBook(title, author, language);
    const words = book.wordList.map(item => item.word);
    return words;
  } catch (error) {
    console.log(error)
    throw new Error(error);
  }
}

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
  getAllBooks,
  getBooks,
  getCleanWordList
};