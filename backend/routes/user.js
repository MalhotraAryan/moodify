var secrets = require('../config/secrets');
const User = require('../models/user');
const Song = require("../models/song");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { getQueryResults } = require("../utils/queries.js");
const { TAGS } = require("../constants.js");

const createToken = (_id) => {
    return jwt.sign({ _id }, secrets.JWT_SECRET, { expiresIn: '3d' });
};

module.exports = function (router) {
    // USER LOGIN ROUTES
    var loginRoute = router.route('/user/login');
    var signupRoute = router.route('/user/signup');
    var resetPasswordRoute = router.route('/user/reset');
    var forgotPasswordRoute = router.route('/user/forgot');
    var updateUser = router.route('/user/update');

    // USER ACCESS ROUTES (ensure password isn't returned)
    const userRoute = router.route("/user");
    const userIdRoute = router.route("/user/:username");

    userRoute.get(async function (req, res) {
        const query = User.find().select({ password: 0 });
        getQueryResults(query, req, res);
    });

    userIdRoute.get(async function (req, res) {
        const username = req.params.username;
        const query = User.findOne({ username: username }).select({ song_lib: 1 });
        getQueryResults(query, req, res);
    });

    userIdRoute.put(async function (req, res) { // only updates song_lib, status=204 if nothing changed
        const username = req.params.username;
        var { _id_song, tag } = req.body;

        if (!_id_song) {
            res.status(404).json({
                message: "song_id not provided",
                data: null
            });
            return;
        }

        if (tag && !TAGS.includes(tag)) {
            res.status(404).json({
                message: "invalid tag",
                data: null
            });
            return;
        }

        await User.db.transaction(async function (session) {
            const user = await User.findOne({ username: username }).select({ song_lib: 1 });
            if (!user) {
                res.status(404).json({
                    message: "User not found",
                    data: null
                });
                return;
            }

            const song = await Song.findById(_id_song);
            if (!song) {
                res.status(404).json({
                    message: "Song not found",
                    data: null
                });
                return;
            }

            if (!tag) {
                tag = song.tag;
            }

            var updateProps = {};
            user.song_lib.forEach((value, key) => {
                const contains_song = value.includes(song._id);
                if (key === tag && !contains_song) {
                    updateProps["$push"] = { [`song_lib.${tag}`]: song._id };
                } else if (key !== tag && contains_song) {
                    updateProps["$pull"] = { [`song_lib.${key}`]: song._id };
                }
            });

            if (Object.keys(updateProps).length === 0) { // nothing will change
                res.status(200).json({
                    message: "No change",
                    data: user.song_lib
                });
                return;
            }

            const updatedUser = await User.findOneAndUpdate(
                { username: username },
                updateProps,
                { new: true }
            );

            res.status(200).json({
                message: "Updated user song_lib",
                data: updatedUser.song_lib
            });
        })
        .catch((mongo_err) => {
            res.status(404).json({
                message: "Mongo Error",
                data: mongo_err
            });
        });
    });

    userIdRoute.delete(async function (req, res) { // only updates song_lib, status=204 if nothing changed
        const username = req.params.username;
        var { _id_song } = req.body;

        if (!_id_song) {
            res.status(404).json({
                message: "song_id not provided",
                data: null
            });
            return;
        }

        await User.db.transaction(async function (session) {
            const user = await User.findOne({ username: username }).select({ song_lib: 1 });
            if (!user) {
                res.status(404).json({
                    message: "User not found",
                    data: null
                });
                return;
            }

            const song = await Song.findById(_id_song);
            if (!song) {
                res.status(404).json({
                    message: "Song not found",
                    data: null
                });
                return;
            }

            var updateProps = {};
            user.song_lib.forEach((value, key) => {
                const contains_song = value.includes(song._id);
                if (contains_song) {
                    updateProps["$pull"] = { [`song_lib.${key}`]: song._id };
                }
            });

            if (Object.keys(updateProps).length === 0) { // nothing will change
                res.status(200).json({
                    message: "No change",
                    data: user.song_lib
                });
                return;
            }

            const updatedUser = await User.findOneAndUpdate(
                { username: username },
                updateProps,
                { new: true }
            );

            res.status(200).json({
                message: "Updated user song_lib",
                data: updatedUser.song_lib
            });
        })
        .catch((mongo_err) => {
            res.status(404).json({
                message: "Mongo Error",
                data: mongo_err
            });
        });
    });

    loginRoute.post(async function (req, res) {
        const { email, username, password } = req.body;
        try {
            const user = await User.login(email, username, password);
            const token = createToken(user._id);
            res.status(200).json({ username: user.username, email: user.email, token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }   
    });

    signupRoute.post(async function (req, res) {
        const { username, email, password } = req.body;
        try {
            const user = await User.signup(username, email, password);
            const token = createToken(user._id)
            res.status(200).json({
                username,
                email,
                token
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        };
    });

    resetPasswordRoute.post(async function (req, res) {
        const { email, newPasswordOne } = req.body;
        try {
            const user = await User.resetPassword(email, newPasswordOne);
            return res.send({ Status: 'Success' });
        } catch (error) {
            return res.send({ Status: "Failed", error: error.message});
        }
    });

    forgotPasswordRoute.post(async function (req, res) {
        const { email } = req.body;
        if (!email) {
            return res.send({ Status: 'Failed', error: "Email is required" });
        }
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    return res.send({ Status: 'Failed', error: "User does not exist." });
                }
                const otp = Math.floor(1000 + Math.random() * 9000);
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: `${secrets.EMAIL}`,
                        pass: `${secrets.GAPP_PASS}`
                    }
                });

                var mailOptions = {
                    from: `${secrets.EMAIL}`,
                    to: email,
                    subject: 'Reset your password',
                    text: `OTP to reset password is ${otp}`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        return res.send({ Status: "Failed", error: "Could not send the email."})
                    } else {
                        return res.send({ Status: "Success", OTP: otp })
                    }
                });
            })
    });

    updateUser.put(async function (req, res) {
        const { email, newEmail, newUsername } = req.body;

        if (!newEmail && !newUsername) {
            return res.send({ Status: "Failed", error: "No details to update!" });
        }
        
        const toUpdate = {}
        if (newEmail) {
            toUpdate.email = newEmail;
        }
        if (newUsername) {
            toUpdate.username = newUsername;
        }
        
        const user = await User.findOneAndUpdate(
            { email },
            toUpdate,
            { new: true }
        );
    
        if (!user) {
            return res.send({ Status: "Failed", error: "User not found in DB!" });
        }
        return res.send({ Status: "Success", error: "User details updated successfully" });
    });

    return router;
}
