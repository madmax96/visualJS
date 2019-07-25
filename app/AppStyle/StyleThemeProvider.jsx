import {
  ThemeProvider,
} from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import React, { useContext } from 'react';
import { GlobalStateContext } from '../GlobalStateProvider';

const themes = {
  dark: {
    palette: {
      primary: {
        main: '#323330',
        dark: '#0a0c07',
        light: '#5b5c59',
      },
      secondary: {
        main: '#f0db4f',
        dark: '#baaa15',
        light: '#ffff81',
      },
    },
  },
  light: {
    palette: {
      primary: {
        main: '#eeeeee',
        dark: '#bcbcbc',
        light: '#ffffff',
      },
      secondary: {
        main: '#ffecb3',
        dark: '#cbba83',
        light: '#ffffe5',
      },
    },
  },
};

export default ({ children }) => {
  const { theme } = useContext(GlobalStateContext);
  const currentTheme = createMuiTheme(themes[theme]);
  return (
    <ThemeProvider theme={currentTheme}>
      {children}
    </ThemeProvider>
  );
};
