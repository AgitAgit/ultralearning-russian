const express = require('express')
const { getAllCards, addCard } = require('../controllers/flashcardController')

const router = express.Router()

router.get("/", getAllCards)

router.post("/add-one", addCard)

module.exports = router