import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

const ArtistGrid = (props) => {
    const { classes, artists } = props;
    return (
        <Grid container spacing={3} justify="center">
            {artists.map((artist) => (
                <Grid item className={classes.container} key={artist.id}>
                    {artist.images[1] ? (
                        <img
                            src={artist.images[1].url}
                            alt="playlist"
                            className={classes.playlistPic}
                        />
                    ) : (
                        <Box
                            height={300}
                            width={300}
                            className={classes.missingPic}
                        ></Box>
                    )}

                    <div className={classes.aboutOverlay}>{artist.name}</div>
                </Grid>
            ))}
        </Grid>
    );
};

export default ArtistGrid;
