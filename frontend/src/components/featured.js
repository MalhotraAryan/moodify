import "../homeStyles.css"
import MusicDisplay from "./music_display";
import Grid from '@mui/material/Grid2';

function getFeatured(arr) {
    // const count = 4

    // const shuffledArray = [...arr];
    // for (let i = shuffledArray.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));
    //     [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    // }

    // return shuffledArray.slice(0, count);

    return arr.slice(0, 4);
}


function Featured({ featuredSongs, userLibrary, setUserLibrary }) {

    return (
        <div>
            <h2>
                Featured
            </h2>
            <div className="mainMedia">
                <Grid container spacing={5} sx={{ p: 3 }}>
                    {
                        (getFeatured(featuredSongs)).map((t) => {
                      

                            return (<Grid size={{ xs: 6, md: 6, lg: 3 }}>
                                <MusicDisplay track={t} setUserLibrary={setUserLibrary} userLibrary={userLibrary}/>
                            </Grid>)
                        })
                    }
                </Grid>
            </div>
        </div>
    )
}

export default Featured