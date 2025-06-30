const express = require('express')
const { getAllCards, addCard, createDeck, getDeck, addCardToDeck, removeCardFromDeck } = require('../controllers/flashcardController')

const router = express.Router()

router.get("/", getAllCards)

router.post("/add-one", addCard)

router.post("/create-deck", createDeck);

router.get("/deck/:name", getDeck)

router.post("/add-one-to-deck", addCardToDeck)

router.post("/remove-one-from-deck", removeCardFromDeck);

module.exports = router