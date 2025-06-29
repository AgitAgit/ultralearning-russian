const express = require("express");
const {
  getAllUsers,
  getUserByUsername,
  addUser,
  login,
  logout,
  updateUserData,
  deleteUser,
  addWordsToUser,
  getUserWords
} = require("../controllers/usersController.js");

const { getCleanWordList } = require("../controllers/booksController.js")

const { uniquePercent } = require("../functions/stringManipulation.js")

const router = express.Router();

router.get("/", getAllUsers);

// router.get("/data", authUser, getUserData);

// router.get("/data/:id", authUser, getUserData);

// router.get("/:username", getUserByUsername);

router.post("/signup", addUser);

router.post("/login", login);

router.post("/add-words", async (req, res) => {
  try {
    const { username, words } = req.body;
    const result = await addWordsToUser(username, words)
    res.json(result);
  } catch (error) {
    console.log(error)
    res.status(500).json("something went wrong...")
  }
})

router.get("/words/:username", async (req, res) => {
  try {
    const { username } = req.params
    const words = await getUserWords(username)
    res.json(words)
  } catch (error) {
    console.log(error)
    res.status(500).json("something went wrong...")
  }
})

router.post("/known-words-percent", async (req, res) => {
  try {

    const { username, title, author, language } = req.body
    const words = await getUserWords(username)
    const bookWords = await getCleanWordList(title, author, language);
    const knownPercent = Math.round(uniquePercent(words, bookWords) * 100) / 100 //Will this cover all language cases?
    res.json({username, title, knownPercent})
  } catch (error) {
    console.log(error)
    res.status(500).json("something went wrong...")
  }
})

// router.post("/logout", logout);

// router.patch("/", updateUserData)

// router.delete("/:id", authUser, deleteUser);

module.exports = router;