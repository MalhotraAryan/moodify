import Stack from '@mui/material/Stack';
import "../homeStyles.css"
import "../musicDisplayStyles.css"
import HomeListItem from "./home_list_item";

function HomeList({ songsToList, userLibrary, setUserLibrary }) {

    return (
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
                    <HomeListItem key={t._id} track={t} setUserLibrary={setUserLibrary} userLibrary={userLibrary} />
                )
            })}
        </Stack>
    )
}

export default HomeList