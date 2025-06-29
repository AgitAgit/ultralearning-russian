const Flashcard = require("../models/Flashcard.js");

async function addCard(req, res, next) {
    try {
        const { top, bottom, topLanguage, bottomLanguage } = req.body
        const card = new Flashcard({
            top,
            bottom,
            topLanguage,
            bottomLanguage
        })
        const result = await card.save();
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json("something went wrong...")
    }
}

async function getAllCards(req, res, next) {
    try {
        const cards = await Flashcard.find()
        res.json(cards)
    } catch (error) {
        console.log(error)
        res.json("something went wrong...")
    }
}

module.exports = {
    addCard,
    getAllCards
};