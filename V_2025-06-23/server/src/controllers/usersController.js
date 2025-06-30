// const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User.js");

async function getAllUsers(req, res, next) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

async function getUserByUsername(req, res, next){
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username});
    res.json({ message: { foundUser: user } });
  } catch (error) {
    next(error);
  }
}


async function addUser(req, res, next) {
  try {
    const { username, password } = req.body;
    const hashedPass = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      // password
      password: hashedPass,
      // plainPassword:password
    });
    const result = await user.save();
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body; 
    if (!username || !password)
      return res
    .status(400)
    .json({ message: "username and password are required...", login:false});
    const storedUser = await User.findOne({ username }); //check if the user exists and extract it from the db
    // console.log("stored user:", storedUser);
    if (!storedUser)
      return res.json({ message: `could not find user with username ${username}`, login:false});
    const isValid = bcrypt.compareSync(password, storedUser.password); //use bcrypt to test if the login password matches the stored one
    // const isValid = password === storedUser.password;
    if (!isValid)
      return res.json({ message: "Invalid password...", login:false });
    // const token = jwt.sign(
    //   //generate a jwt token with payload containing the mongo id, name, email, and user plan. 
    //   {
    //     user: {
    //       _id: storedUser._id,
    //       name: storedUser.name,
    //       email: storedUser.email, 
    //       plan: storedUser.plan,
    //     },
    //   },
    //   secretKey,
    //   { expiresIn: "1h" }
    // );
    console.log("a user has logged in...");
    res.status(200)
    // .cookie("jwt",token)
    .json({ message: `User ${username} logged in successfully.`, login:true });
    } catch (error) {
    next(error);
  }
}

async function addWordsToUser(username, words){
  const user = await User.findOne({username})
  const newWordsToAdd = words.filter(word => !user.words.includes(word));
  if (newWordsToAdd.length > 0) {
    // Only push if there are new words to add
    user.words.push(...newWordsToAdd);
    const result = await user.save();
    return result;
  }
  else {
    console.log(`No new words to add for user '${username}'. All words already exist.`);
    return user;
  }
}

async function removeWordsFromUser(username, words){
  try {
    
    const user = await User.findOne({username})
    user.words.pull(...words)
    const result = await user.save()
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(error)  
  }
}

async function getUserWords(username){
  const user = await User.findOne({username})
  return user.words
}

async function logout(req, res, next) {
  try {
    
  } catch (error) {
    next(error);
  }
}

// async function updateUserData(req, res, next) {
//   try {
//     const { userWithNewData } = req.body
//     const existingUser = await User.findOne({username:userWithNewData.username});
//     if (!existingUser) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     const updatedUser = await User.findByIdAndUpdate(existingUser._id, userWithNewData);
    
//     res.status(201).json({ message: "User updated successfully!", updatedUser });
//   } catch (error) {
//     next(error);
//   }
// }

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const result = await User.findByIdAndDelete(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addUser,
  getAllUsers,
  getUserByUsername,
  login,
  logout,
  // updateUserData,
  deleteUser,
  addWordsToUser,
  removeWordsFromUser,
  getUserWords
};

// export const deleteUserById = async function (req, res, next) {
  //   try {
//     const reply = await User.findByIdAndDelete(req.params.id);
//     res.json({ message: "delete successful", reply });
//     next();
//   } catch (error) {
  //     next(error);
  //   }
  // };

  // async function getUserData(req, res, next) {
  //   try {
  //     const userId = req.params.id ? req.params.id : req.user.userId;
  
  //     const user = await User.findById(userId);
  
  //     const userPosts = await Post.find({ authorId: userId });
  //     const followers = await Follower.countDocuments({ userId });
  //     const following = await Follower.countDocuments({ followerId: userId });
  
  //     const userPostData = userPosts.map((post) => ({
  //       _id: post._id,
  //       postImageUrl: post.postImageUrl,
  //     }));
  
  //     res.json({ user, Posts: userPostData, followers, following });
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
  // }
