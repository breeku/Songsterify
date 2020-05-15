import React, { useState } from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";

const Tab = (track) => {
    const [open, setOpen] = useState(true);

    /* istanbul ignore next */
    const handleClick = () => {
        setOpen(!open);
    };
    console.log(track.tab.tuning);

    return (
        <React.Fragment>
            <Divider />
            <ListItem button onClick={handleClick}>
                <ListItemText />
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
                                    <br />
                                    {track.tab.tuning ? (
                                        <React.Fragment>
                                            {track.tab.tuning.octaves} <br />{" "}
                                            {track.tab.tuning.name}
                                            <br /> {track.tab.tuning.notes}
                                        </React.Fragment>
                                    ) : (
                                        "unknown"
                                    )}
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                </List>
            </Collapse>
            <Divider />
        </React.Fragment>
    );
};

export default Tab;
