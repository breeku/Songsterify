import React, {useState, useEffect} from "react"
import Snackbar from "@material-ui/core/Snackbar"
import SnackbarContent from "@material-ui/core/SnackbarContent"
import IconButton from "@material-ui/core/IconButton"
import CloseIcon from "@material-ui/icons/Close"
import ErrorIcon from "@material-ui/icons/Error"
import { withStyles } from "@material-ui/core/styles"

const styles = theme => ({
    error: {
        backgroundColor: theme.palette.error.dark,
      },
      message: {
        display: 'flex',
        alignItems: 'center',
      },
      icon: {
        fontSize: 20,
        opacity: 0.9,
        marginRight: theme.spacing(1),
      },
})

function MySnackbarContentWrapper(props) {
    const { classes, onClose, artistLimit } = props;
    return (
        <SnackbarContent
            aria-describedby="client-snackbar"
            className={classes.error}
            message={
                <span
                    id="client-snackbar"
                    className={classes.message}
                >
                    <ErrorIcon className={classes.icon}/>
                    <h4>Sorry! Your playlist's artist count exceeds the current limit of {artistLimit}.</h4>
                </span>
            }
            action={[
                <IconButton
                    key="close"
                    aria-label="close"
                    color="inherit"
                    onClick={onClose}
                >
                    <CloseIcon
                        className={classes.icon}
                    />
                </IconButton>
            ]}
        />
    )
}

const Warning = (props) => {
    const [open, setOpen] = useState(false);
    const { classes, artistLimit, show } = props

    useEffect(() => {
        if (show) setOpen(true)
    }, [show])
    
      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };
      return (
        <div>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
          >
          <MySnackbarContentWrapper
            classes={classes}
            artistLimit={artistLimit}
            onClose={handleClose}
          />
          </Snackbar>
        </div>
      );

}

export default withStyles(styles)(Warning)
