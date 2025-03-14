import axios from 'axios';
import { baseURL } from '../base';


/*
    Function returns:
        - on error, undefined
        - on success, new user_lib
*/

// function adds song to user lib on db
export async function addSongToUserLib(username, song_id, tag) {
    var params = {
        _id_song: song_id,
    };

    if (tag) params["tag"] = tag;

    await axios.put(baseURL + `/api/user/${username}`, params)
        .then((res) => {
            console.log(res);
            if (res.status === 200) {
                return res.data.data;
            }
        })
        .catch( (err) => console.log(err) );
}

// function delete song from userlib on db (changed params)
export async function deleteSongFromUserLib(username, song_id) {
    var params = {
        _id_song: song_id,
    };

    await axios.delete(baseURL + `/api/user/${username}`, {
        data: params
    })
        .then((res) => {
            console.log(res);
            if (res.status === 200) {
                return res.data.data;
            }
        })
        .catch( (err) => console.log(err) );
}


