import Vibrant from "node-vibrant"

const getBackgroundColor = async img => {
    // https://github.com/idanlo/react-spotify/blob/master/src/Components/PlaylistView/PlaylistView.jsx
    const palette = await Vibrant.from(img).getPalette()
    let rgb = palette.DarkMuted._rgb.join(", ")
    let color = "rgb(" + rgb + ")"
    let bgImage = `linear-gradient(${color}, rgb(6, 9, 10) 85%)`
    return bgImage
}

export default getBackgroundColor