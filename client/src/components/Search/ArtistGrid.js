import React from "react"
import Grid from "@material-ui/core/Grid"
import Box from "@material-ui/core/Box"

const ArtistGrid = props => {
    const { classes, artists } = props
    return (
        <Grid container spacing={3} justify="center">
            {artists.map(artist => (
                <Grid item key={artist.id}>
                    <Box height={300} width={300}>
                    <img
                        src={artist.images[1] ? artist.images[1].url : null}
                        alt="artist"
                        className={classes.playlistPic}
                    />
                    </Box>
                </Grid>
            ))}
        </Grid>
    )
}

export default ArtistGrid
