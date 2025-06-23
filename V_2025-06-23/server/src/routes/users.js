const express = require("express");
const {
  getAllUsers,
  getUserByUsername,
  addUser,
  login,
  logout,
  updateUserData,
  deleteUser,
} = require("../controllers/usersController.js");

const router = express.Router();

router.get("/", getAllUsers);

// router.get("/data", authUser, getUserData);

// router.get("/data/:id", authUser, getUserData);

// router.get("/:username", getUserByUsername);

router.post("/signup", addUser);

router.post("/login", login);

// router.post("/logout", logout);

// router.patch("/", updateUserData)

// router.delete("/:id", authUser, deleteUser);

module.exports = router;