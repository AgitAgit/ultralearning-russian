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

bookSchema.index({ title: 1, author: 1, language:1 }, { unique: true });

const Book = model("Book", bookSchema);
module.exports = Book;