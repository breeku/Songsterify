import { useEffect } from "react"
import auth from "../services/auth"
import { withRouter } from "react-router-dom"

import { connect } from "react-redux"
import { setToken } from "../reducers/authReducer"

/* istanbul ignore next */
const Callback = props => {
    const code = props.location.search.slice(6)

    useEffect(() => {
        const getToken = async () => {
            try {
                await auth.login(code)
                props.setToken()
            } catch (e) {
                console.log(e)
            }
        }
        getToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code])

    return (
        null
    )
}

export default withRouter(
    connect(
        null,
        { setToken }
    )(Callback)
)
