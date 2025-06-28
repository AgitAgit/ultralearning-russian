const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    words: [{
        word: String,
        language: { type: String, required: true, enum: ["english", "russian", "hebrew"] }
    }]
    //   email: { type: String, required: true, unique: true },
    //   plainPassword: { type: String, required: false},
    //   plan: { type: String, enum: ["Standard", "Gold", "Platinum"], default: "Standard" },
    //   savedBusinesses: [{ type: Schema.Types.ObjectId, ref: "Business" }],
},
    {
        timestamps: true,
        versionKey: false
    });

const User = model("User", userSchema);
module.exports = User;