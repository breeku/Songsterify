import React from "react"

import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        backgroundImage: "linear-gradient(rgb(56, 64, 103), rgb(6, 9, 10) 85%)",
        width: "100%",
        minHeight: "100vh"
    },
    toolbar: theme.mixins.toolbar,
    content: {
        marginLeft: 300,
        flexGrow: 1,
        padding: theme.spacing(3),
        color: "whitesmoke"
    },
    about: {
        textAlign: "center"
    },
    a: {
        color: "whitesmoke",
    },
}))

const About = () => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <div className={classes.about}>
                    <h1>About</h1>
                    <p>Created by <a className={classes.a} href="https://github.com/breeku" target="!blank">breeku</a></p>
                    <p>Source at <a className={classes.a} href="https://github.com/breeku/Songsterify" target="!blank">Github</a></p>
                    <p><a className={classes.a} href="mailto:jmatias.makela@gmail.com">Contact</a></p>
                    <p><a className={classes.a} href="https://matiasmakela.com/" target="!blank">matiasmakela.com</a></p>
                </div>
            </main>
        </div>
    )
}

export default About
