const { Schema, model } = require("mongoose");

const flashcardSchema = new Schema({
    top: { type: String, required: true },
    bottom: { type: String, required: true },
    topLanguage: { type: String, enum: ["english", "russian", "hebrew"] },
    bottomLanguage: { type: String, enum: ["english", "russian", "hebrew"] },
    score: { type: Number, default: 0 }
},
    {
        timestamps: true,
        versionKey: false
    });

flashcardSchema.index({ top: 1, bottom: 1, topLanguage: 1, bottomLanguage: 1 }, { unique: true });

const Flashcard = model("Flashcard", flashcardSchema);
module.exports = Flashcard;