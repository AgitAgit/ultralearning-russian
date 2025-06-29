const { Schema, model } = require("mongoose");

const deckSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    // This is the key part: an array of references to Flashcard documents
    cards: [{
        type: Schema.Types.ObjectId, // Specifies that this will store MongoDB ObjectId values
        ref: 'Flashcard'             // This tells Mongoose which model to use when populating
    }],
    owner: { // Optional: if users own decks
        type: Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        // required: true, // Uncomment if every deck must have an owner
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});


const Deck = model("Deck", deckSchema);

module.exports = Deck;