import React from "react";
import Grid from "@material-ui/core/Grid";

import { Link } from "react-router-dom";

const AlbumGrid = (props) => {
    const { classes, albums } = props;
    return (
        <Grid container spacing={3} justify="center">
            {albums.map((album) => (
                <Grid item key={album.id}>
                    <Link
                        className={classes.a}
                        to={{
                            pathname: "/album/" + album.id,
                            state: { album },
                        }}
                    >
                        <img
                            src={album.images[1].url}
                            alt="album"
                            className={classes.playlistPic}
                        />
                    </Link>
                </Grid>
            ))}
        </Grid>
    );
};

export default AlbumGrid;
