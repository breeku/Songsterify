import React from "react"

import Grid from "@material-ui/core/Grid"
import Skeleton from '@material-ui/lab/Skeleton';

const SkeletonPlaylist = () => {
    return (
        <React.Fragment>
            <Grid
                container
                direction="row"
                alignItems="center"
            >
                <Grid item style={{paddingLeft: 20}}> 
                    <Skeleton width={300} height={300}/>
                </Grid>
                <Grid item xs style={{paddingLeft: 20}}>
                    <Skeleton component="h2" width={300} height={40}/>
                    <Skeleton component="h1" width={300} height={40}/>
                    <Skeleton component="p" width={300} height={40}/>
                    <Skeleton width={90} height={40}/>
                </Grid>
            </Grid>
            <div style={{marginTop: "1em"}}>
                <Skeleton height={50} width={"100%"}/>
                <Skeleton height={50} width={"100%"}/>
                <Skeleton height={50} width={"100%"}/>
                <Skeleton height={50} width={"100%"}/>
                <Skeleton height={50} width={"100%"}/>
                <Skeleton height={50} width={"100%"}/>
            </div>
        </React.Fragment>
    )
}

export default SkeletonPlaylist