import React, { useEffect } from "react"
import auth from "../services/auth"
import CircularProgress from "@material-ui/core/CircularProgress"
import { withRouter } from "react-router-dom"

import { connect } from "react-redux"
import { setTokens } from "../reducers/authReducer"

const Callback = props => {
    const code = props.location.search.slice(6)

    useEffect(() => {
        const getToken = async () => {
            try {
                const response = await auth.login(code)
                let accToken = response.accessToken
                let refToken = response.refreshToken

                const tokens = {
                    accessToken: accToken,
                    refreshToken: refToken
                }

                props.setTokens(tokens)
            } catch (e) {
                console.log(e)
            }
        }
        getToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code])

    return (
        <React.Fragment>
            <CircularProgress />
        </React.Fragment>
    )
}

export default withRouter(
    connect(
        null,
        { setTokens }
    )(Callback)
)
