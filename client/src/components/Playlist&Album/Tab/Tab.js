import React, { useState } from "react"

import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Collapse from "@material-ui/core/Collapse"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"
import List from "@material-ui/core/List"
import Divider from "@material-ui/core/Divider"

const Tab = track => {
    const [open, setOpen] = useState(true)
    const id = track.tab.instrumentId
    if (id === 30 || id === 34) {
        let tuning = ""
        /* istanbul ignore else */
        if (track.tab.tuning.length === 7) {
            // 7 string
            for (const tune of track.tab.tuning.reverse()) {
                if (tune === 64) {
                    tuning += "e"
                } else if (tune === 59) {
                    tuning += "B"
                } else if (tune === 55) {
                    tuning += "G"
                } else if (tune === 50) {
                    tuning += "D"
                } else if (tune === 45) {
                    tuning += "A"
                } else if (tune === 38) {
                    tuning += "D"
                } else if (tune === 33) {
                    tuning += "A"
                }
            }
        } else if (track.tab.tuning.length === 6) {
            // 6 string
            for (const tune of track.tab.tuning.reverse()) {
                if (tune === 64) {
                    tuning += "e"
                } else if (tune === 59) {
                    tuning += "B"
                } else if (tune === 55) {
                    tuning += "G"
                } else if (tune === 50) {
                    tuning += "D"
                } else if (tune === 45) {
                    tuning += "A"
                } else if (tune === 40) {
                    tuning += "E"
                } else if (tune === 38) {
                    tuning += "D"
                }
            }
        } else if (track.tab.tuning.length === 5 || 4) {
            // 5 / 4 string, bass
        }

        /* istanbul ignore next */
        const handleClick = () => {
            setOpen(!open)
        }

        return (
            <React.Fragment>
                <Divider />
                <ListItem button onClick={handleClick}>
                    <ListItemText primary={id === 30 ? "Guitar" : "Bass"} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List disablePadding>
                        <ListItem>
                            <ListItemText
                                primary={
                                    <React.Fragment>
                                        Difficulty:{" "}
                                        {track.tab.difficulty
                                            ? track.tab.difficulty
                                            : "unknown"}
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={
                                    <React.Fragment>
                                        Tuning: {tuning ? tuning : "unsupported"}
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                    </List>
                </Collapse>
                <Divider />
            </React.Fragment>
        )
    } else {
        return null
    }
}

export default Tab
