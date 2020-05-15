import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

import { Link } from "react-router-dom";

const PlaylistGrid = (props) => {
    const { classes, playlists } = props;
    return (
        <Grid container spacing={3} justify="center">
            {playlists.map((playlist) => (
                <Grid item className={classes.container} key={playlist.id}>
                    <Link
                        className={classes.a}
                        to={{
                            pathname: "/playlist/" + playlist.id,
                            state: { playlist },
                        }}
                    >
                        {playlist.images[1] ? (
                            <img
                                src={playlist.images[1].url}
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
                    </Link>
                    <div className={classes.aboutOverlay}>
                        {playlist.name} <br /> Tracks: {playlist.tracks.total}{" "}
                        <br /> By: {playlist.owner.display_name}
                    </div>
                </Grid>
            ))}
        </Grid>
    );
};

export default PlaylistGrid;
