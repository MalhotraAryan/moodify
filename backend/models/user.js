const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { TAGS } = require("../constants.js");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    song_lib: {
        type: Map,
        of: [mongoose.Schema.Types.ObjectId],
        default: () => {
            const tag_map = {};
            TAGS.forEach(tag => {
                tag_map[tag] = [];
            });
            return tag_map;
        },
        validate: {
            validator: map => {
                return Array.from(map.keys()).every(tag => TAGS.includes(tag));
            },
            message: props => `Invalid song tags: ${Array.from(props.value.keys())}`
        },
        required: false
    }
});

// static signup method
userSchema.statics.signup = async function (username, email, password) {
    // validation
    if (!username || !email || !password) {
        throw new Error('All fields must be filled.');
    };
    if (!validator.isEmail(email)) {
        throw new Error('Email is not valid');
    };
    if (!validator.isStrongPassword(password)) {
        throw new Error('Password is not strong enough');
    }

    const exists = await this.findOne({ email });
    if (exists) {
        throw Error('User already exists!');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ username, email, password: hash });

    return user;
};

// static login method
userSchema.statics.login = async function (email, username, password) {
    if (!email && !username) {
        throw new Error('Either Email or Username must be filled');
    }
    if (!password) {
        throw new Error('Password is required');
    };
    const toFind = {}
    if (email) {
        toFind.email = email;
    } else {
        toFind.username = username;
    }
    const user = await this.findOne(toFind);
    if (!user) {
        throw Error("User doesn't exist!");
    };

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error("Wrong Password!");
    };

    return user;
};

userSchema.statics.resetPassword = async function (email, newPasswordOne) {
    if (!email || !newPasswordOne) {
        throw new Error('All fields must be filled.');
    };

    const user = await this.findOne({ email: email });
    if (!user) {
        throw new Error("User doesn't exist!");
    }
    if (!validator.isStrongPassword(newPasswordOne)) {
        throw new Error('Password is not strong enough');
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPasswordOne, salt);
    user.password = hash;
    await user.save();

    return user;
};


module.exports = mongoose.model('User', userSchema);