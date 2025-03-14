const secrets = require("../config/secrets");
const User = require("../models/user");
const Song = require("../models/song");
const { getQueryResults } = require("../utils/queries.js");


module.exports = function (router) {
    const songRoute = router.route("/song");
    const songIdRoute = router.route("/song/:id");

    songRoute.post(async function (req, res) {
        const newSong = Song(req.body);
        const err = newSong.validateSync();
        if (err) {
            console.log(err);
            res.status(400).json({
                message: "Invalid args to create new song",
                data: null
            });
            return;
        }
        await Song.db.transaction(async function (session) {
            const savedSong = await newSong.save();
            res.status(200).json({
                message: `Created new song ${savedSong.strTrack}`,
                data: savedSong
            });
        })
        .catch((mongo_err) => {
            res.status(404).json({
                message: "Mongo Error",
                data: mongo_err
            });
        });
    });

    songRoute.get(async function (req, res) {
        const query = Song.find();
        getQueryResults(query, req, res);
    });

    songIdRoute.get(async function (req, res) {
        const songId = req.params.id;
        const query = Song.findById(songId);
        getQueryResults(query, req, res);
    });

    return router;
};



