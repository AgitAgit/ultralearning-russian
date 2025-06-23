const { Schema, model } = require("mongoose");

const bookSchema = new Schema({
    title: { type: String, required: true },
    wordlist: [{
        word: String,
        count: Number
    }],
    author: String,
    language: { type: String, enum: ["english", "russian", "hebrew"] },
},
    {
        timestamps: true,
        versionKey: false
    });

const Book = model("Book", bookSchema);
module.exports = Book;