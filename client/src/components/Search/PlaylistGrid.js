import React from "react"
import Grid from "@material-ui/core/Grid"
import Box from "@material-ui/core/Box"

import { Link } from "react-router-dom"

const PlaylistGrid = props => {
    const { classes, playlists } = props
    return (
        <Grid container spacing={3} justify="center">
            {playlists.map(playlist => (
                <Grid item key={playlist.id}>
                    <Link
                        className={classes.a}
                        to={{
                            pathname: "/playlist/" + playlist.id,
                            state: { playlist }
                        }}
                    >
                        <Box height={300} width={300}>
                        <img
                            src={playlist.images[1] ? playlist.images[1].url : null}
                            alt="playlist"
                            className={classes.playlistPic}
                        />
                        </Box>
                    </Link>
                </Grid>
            ))}
        </Grid>
    )
}

export default PlaylistGrid
