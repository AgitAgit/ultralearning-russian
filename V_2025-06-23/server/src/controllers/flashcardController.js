const Flashcard = require("../models/Flashcard.js");
const Deck = require("../models/Deck.js");

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

async function createDeck(req, res, next) {
    try {
        const { name, description } = req.body
        const deck = new Deck({
            name,
            description
        })
        const result = await deck.save()
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json("something went wrong...")
    }
}

async function getDeck(req, res, next){
    try {
        const { name } = req.params
        const deck = await Deck.findOne({name}).populate("cards")
        res.json(deck)
    } catch (error) {
        console.log(error)
        res.json("something went wrong...")
    }
}

async function addCardToDeck(req, res, next) {
    try {
        const { name, _id, top, bottom, topLanguage, bottomLanguage } = req.body;
        const deck = await Deck.findOne({ name })
        if (_id) {
            deck.cards.push(_id)
        }
        else {
            const card = await Flashcard.findOne({top, bottom, topLanguage, bottomLanguage})
            deck.cards.push(card._id)
        }
        const result = await deck.save()
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json("something went wrong...")//I could just next(error) and create a catchall error handler
    }
}

async function removeCardFromDeck(req, res, next) {
    try {
        const { name, _id, top, bottom, topLanguage, bottomLanguage } = req.body;
        const deck = await Deck.findOne({ name })
        if (_id) {
            deck.cards.pull(_id)
        }
        else {
            const card = await Flashcard.findOne({top, bottom, topLanguage, bottomLanguage})
            deck.cards.pull(card._id)
        }
        const result = await deck.save()
        res.json(result)
    } catch (error) {
        console.log(error)
        res.json("something went wrong...")//I could just next(error) and create a catchall error handler
    }
}

module.exports = {
    addCard,
    getAllCards,
    createDeck,
    getDeck,
    addCardToDeck,
    removeCardFromDeck
};