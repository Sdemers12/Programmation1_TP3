const mongoose = require("mongoose");
passportLocalMongoose = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
}, {
    timestamps: true
});

userSchema.plugin(passportLocalMongoose, {
    passwordField: "password",
    usernameField: "email"
});

module.exports = mongoose.model("User", userSchema);