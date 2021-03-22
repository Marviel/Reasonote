import {createMuiTheme} from '@material-ui/core';

export const materialUItheme = createMuiTheme({
    typography: {
      fontFamily: [
        '"Atkinson-Hyperlegible"',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        '"Roboto"',
        '"Helvetica Neue"',
        '"Arial"',
        '"sans-serif"',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  });