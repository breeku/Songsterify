import React from "react";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: theme.root,
    toolbar: theme.mixins.toolbar,
    content: theme.content,
    about: {
        textAlign: "center",
    },
    a: {
        color: "whitesmoke",
    },
}));

const About = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <div className={classes.about}>
                    <h1>About</h1>
                    <p>
                        Created by{" "}
                        <a
                            className={classes.a}
                            href="https://github.com/breeku"
                            target="!blank"
                        >
                            breeku
                        </a>
                    </p>
                    <p>
                        Source at{" "}
                        <a
                            className={classes.a}
                            href="https://github.com/breeku/Songsterify"
                            target="!blank"
                        >
                            Github
                        </a>
                    </p>
                    <p>
                        <a
                            className={classes.a}
                            href="mailto:jmatias.makela@gmail.com"
                        >
                            Contact
                        </a>
                    </p>
                    <p>
                        <a
                            className={classes.a}
                            href="https://matiasmakela.com/"
                            target="!blank"
                        >
                            matiasmakela.com
                        </a>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default About;
