import React from "react"
import Skeleton from "@material-ui/lab/Skeleton"

const SkeletonPlaylists = () => {
    return (
        <React.Fragment>
            <Skeleton
                variant="rect"
                width="100%"
                height="calc(100vh - 170px)"
            />
        </React.Fragment>
    )
}

export default SkeletonPlaylists
