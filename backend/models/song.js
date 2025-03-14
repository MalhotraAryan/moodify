// Load required packages
const { TAGS } = require("../constants.js");
var mongoose = require('mongoose');

/*
    We will store TheAudioDB id fields for:
        - artist
        - album
        - track (the song)
    in case we need to do a call for further 
    information, but all relevant info should
    be stored already.

    TODO: add an unknown/missing albumThumb default
*/

// Define our song schema
var SongSchema = new mongoose.Schema(
    {
        artist_id: {
            type: Number,
            required: true
        },
        artist_name: {
            type: String,
            required: true
        },
        album_id: {
            type: Number,
            required: true
        },
        album_name: {
            type: String,
            required: true
        },
        album_image: {
            type: String,
            required: true
        },
        song_id: {
            type: Number,
            required: true
        },
        song_name: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        releasedate: {
            type: Date,
            required: true
        },
        audio_link: {
            type: String,
            required: true
        },
        tag: {
            type: String,
            enum: TAGS,
            required: true
        }
    },
    { strict: true }
);

// Export the Mongoose model
module.exports = mongoose.model('Song', SongSchema);