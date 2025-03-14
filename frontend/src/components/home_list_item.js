import { useEffect } from "react";
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import "../homeStyles.css"
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import "../musicDisplayStyles.css"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { addSongToUserLib, deleteSongFromUserLib } from '../utils/user_lib_handlers'
import { useAuthContext } from '../hooks/useAuthContext';
import Box from '@mui/material/Box';
import * as React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const theme = createTheme({
    palette: {
        secondary: {
            main: '#ffffff'
        }
    }
});

function isInUserLib(userLibObj, id) {
    var userLib = userLibObj['song_lib']
    for (const key in userLib) {
        if (userLib.hasOwnProperty(key)) {
            // console.log(key, userLib[key]);
            for (let i = 0; i < userLib[key].length; i++) {
                if (userLib[key][i] === id) {

                    return true
                }
            }
        }
    }
    return false
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function deletIdFromUserLib(userLibObj, tid) {

    var userLib = userLibObj['song_lib']
    for (const key in userLib) {
        if (userLib.hasOwnProperty(key)) {
            userLib[key] = userLib[key].filter(id => id !== tid)
        }
    }

}

function addIdToUserLib(userLibObj, tid, tag) {

    var userLib = userLibObj['song_lib']
    if (userLib.hasOwnProperty(tag)) {
        userLib[tag].push(tid)
    }

}


function HomeListItem({ track, setUserLibrary, userLibrary }) {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const [value, setValue] = React.useState('Dark');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const { user } = useAuthContext();

    const initalval = isInUserLib(userLibrary, track._id)
    const [filled, setFilled] = React.useState(initalval)
    useEffect(() => { setFilled(isInUserLib(userLibrary, track._id)) }, [userLibrary, track._id])

    const setUnlikedButton = () => {
        setFilled(!filled)
        setUserLibrary(prev => {
            var copyVar = { ...prev }
            deletIdFromUserLib(copyVar, track._id)
            return copyVar
        })
        deleteSongFromUserLib(user.username, track._id)
    }

    const setLikedButton = () => {
        setFilled(!filled)
        setUserLibrary(prev => {
            var copyVar = { ...prev }
            addIdToUserLib(copyVar, track._id, value)
            return copyVar
        })
        setOpen(false)
        addSongToUserLib(user.username, track._id, value)
    }

    return (

        <Stack
            id={track.id}
            direction="row"
            spacing={2}
            sx={{
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px ",
                borderRadius: "5px",
                margin: "10px 0",
                width: "100%",
            }}
        >

            <Avatar
                variant="square"
                alt={track.song_name}
                src={track.album_image}
                sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "5px"
                }}
            />

            <Stack
                direction="row"
                spacing={3}
                sx={{
                    flex: 1,
                    justifyContent: "flex-start",
                    alignItems: "center"
                }}
            >
                <p><strong>Track:</strong> {track.song_name}</p>
                <p><strong>Artist:</strong> {track.artist_name}</p>
                <p><strong>Mood:</strong> {track.tag}</p>
            </Stack>


            <ThemeProvider theme={theme}>
                <IconButton aria-label="add to favorites" color="secondary" onClick={!filled ? handleOpen : setUnlikedButton}>
                    {filled ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
            </ThemeProvider>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <FormControl>
                        <FormLabel id="demo-controlled-radio-buttons-group">Tag</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={value}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="Dark" control={<Radio />} label="Dark" />
                            <FormControlLabel value="Energetic" control={<Radio />} label="Energetic" />
                            <FormControlLabel value="Groovy" control={<Radio />} label="Groovy" />
                            <FormControlLabel value="Misc" control={<Radio />} label="Misc" />
                            <FormControlLabel value="Peaceful" control={<Radio />} label="Peaceful" />
                            <FormControlLabel value="Romantic" control={<Radio />} label="Romantic" />
                            <FormControlLabel value="Sad" control={<Radio />} label="Sad" />
                            <FormControlLabel value="Workout" control={<Radio />} label="Workout" />
                            <FormControlLabel value="World" control={<Radio />} label="World" />
                        </RadioGroup>
                    </FormControl>
                    <Button variant="contained" class="buttonColor" onClick={setLikedButton}>Add To Library</Button>
                </Box>
            </Modal>
        </Stack>

    )

}

export default HomeListItem