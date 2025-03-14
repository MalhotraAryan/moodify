import { useState, useEffect } from "react";
import BubbleView from "../components/bubble_view";
import LibraryList from "../components/library_list";
import Header from "../components/header";

function ListView({ allSongs, userLibrary, setUserLibrary }) {

    const [songs, setSongs] = useState([]);

    const [search, setSearch] = useState("");

    const [filteredSongs, setFilteredSongs] = useState([]);

    const [displayList, setDisplayList] = useState(false);

    useEffect(() => {
        const flatUserLib = Object.values(userLibrary.song_lib).flat();
        const userLibSongs = allSongs.filter(song => flatUserLib.includes(song._id));
        setSongs(userLibSongs);
        setFilteredSongs(userLibSongs);
    }, [allSongs, userLibrary])

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
            setDisplayList(true);
        } else {
            setFilteredSongs(songs);
        }
    }, [search, songs]);

    return (
        <div class="homePage">

            <Header search={search} setSearch={setSearch}/>

            {!displayList 
                ? <BubbleView 
                    allSongs={allSongs} 
                    userLibrary={userLibrary} 
                    setSongs={setSongs}
                    setDisplayList={setDisplayList}
                  /> 
                : <LibraryList 
                    songsToList={filteredSongs} 
                    userLibrary={userLibrary} 
                    setUserLibrary={setUserLibrary}
                    setDisplayList={setDisplayList}
                  />
            }

        </div >
    );
}

export default ListView;