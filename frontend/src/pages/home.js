import { useState, useEffect } from "react";
import "../homeStyles.css"
import Featured from "../components/featured";
import HomeList from "../components/home_list";
import Header from "../components/header";
import React from "react";



function Home({ allSongs, userLibrary, setUserLibrary }) {

    const [songs, setSongs] = useState([]);

    const [search, setSearch] = useState("");

    const [filteredSongs, setFilteredSongs] = useState([]);

    useEffect(() => {
        // let slice = (MusicMockData()).slice(0, 4);
        // console.log(slice);
        setSongs(allSongs);
        setFilteredSongs(allSongs);
    }, [allSongs])

    useEffect(() => {
        if (search) {
            const filtered = songs.filter(
                (song) =>
                    song.song_name.toLowerCase().includes(search.toLowerCase()) ||
                    song.artist_name.toLowerCase().includes(search.toLowerCase()) ||
                    song.album_name.toLowerCase().includes(search.toLowerCase()) ||
                    song.tag.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredSongs(filtered);
        } else {
            setFilteredSongs(songs); 
        }
    }, [search, songs]);


    return (
        <div class="homePage">

            <Header search={search} setSearch={setSearch}/>

            {!search 
                ? <Featured featuredSongs={songs} userLibrary={userLibrary} setUserLibrary={setUserLibrary}/> 
                : <HomeList songsToList={filteredSongs} userLibrary={userLibrary} setUserLibrary={setUserLibrary}/>
            }

        </div >
    );
}

export default Home;