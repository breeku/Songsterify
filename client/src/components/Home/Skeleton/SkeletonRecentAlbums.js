import React from "react"

import Grid from "@material-ui/core/Grid"
import Skeleton from '@material-ui/lab/Skeleton';

const SkeletonRecentAlbums = () => {
    return (
        <div style={{width: "100%"}}>
            <Skeleton width={300} height={40} component="h1" style={{display: "block", marginLeft: "auto", marginRight: "auto", marginTop: 18.7, marginBottom: 18.7}}/>
            <Grid container spacing={3} justify="center">
                <Grid item> 
                    <Skeleton width={300} height={300}/>
                </Grid>
                <Grid item> 
                    <Skeleton width={300} height={300}/>
                </Grid>
                <Grid item> 
                    <Skeleton width={300} height={300}/>
                </Grid>
                <Grid item> 
                    <Skeleton width={300} height={300}/>
                </Grid>
                <Grid item> 
                    <Skeleton width={300} height={300}/>
                </Grid>
                <Grid item> 
                    <Skeleton width={300} height={300}/>
                </Grid>
                <Grid item> 
                    <Skeleton width={300} height={300}/>
                </Grid>
                <Grid item> 
                    <Skeleton width={300} height={300}/>
                </Grid>
            </Grid>
        </div>
    )
}

export default SkeletonRecentAlbums