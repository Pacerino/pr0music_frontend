import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
      primary: {
        main: '#161618',
      },
      secondary: {
        main: '#ee4d2e',
      },
      background: {
        default: '#161618',
        paper: '#212121',
      },
      text: {
        primary: '#f2f5f4',
      },
      error: {
        main: '#d9534f',
      },
      warning: {
        main: '#f0ad4e',
      },
      info: {
        main: '#008fff',
      },
      success: {
        main: '#1db992',
      },
      deezer: {
        main: '#ef5466'
      },
      soundcloud: {
        main: '#ff8800'
      },
      spotify: {
        main: '#1db954'
      },
      youtube: {
        main: '#ff0000'
      },
      apple: {
        main: '#fa243c'
      },
      tidal: {
        main: '#000'
      },
    },
    props: {
      MuiAppBar: {
        color: 'secondary',
      },
    },
  });

export default theme;