import Stack from '@mui/material/Stack';
import "../homeStyles.css"
import "../musicDisplayStyles.css"
import HomeListItem from "./home_list_item";

function LibraryList({ songsToList, userLibrary, setUserLibrary, setDisplayList }) {

    return (
        <div class="library_list">
            <Stack
                direction="column"
                spacing={2}
                sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px",
                    borderRadius: "10px",
                    width: "100%",
                    maxWidth: "1000px",
                    margin: "0 auto",
                }}
            >
                <button
                    class="bubble_back"
                    onClick={() => setDisplayList(false)} // Navigate to the previous page
                >
                    Bubble View
                </button>

                <Stack
                    direction="column"
                    spacing={2}
                    sx={{
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "20px",
                        backgroundColor: "rgba(128, 128, 128, 0.5)",
                        borderRadius: "10px",
                        width: "100%",
                        maxWidth: "1000px",
                        margin: "0 auto",
                    }}
                >
                    {songsToList.map((t) => {
                        return (
                            <HomeListItem key={t.id} track={t} setUserLibrary={setUserLibrary} userLibrary={userLibrary} />
                        )
                    })}
                </Stack>
            </Stack>
        </div>
    );
}

export default LibraryList;