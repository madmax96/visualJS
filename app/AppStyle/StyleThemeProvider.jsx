import {
  ThemeProvider,
} from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import React, { useContext } from 'react';
import { GlobalContext } from '../GlobalContextProvider';

const themes = {
  dark: {
    palette: {
      primary: {
        main: '#323330',
      },
      secondary: {
        main: '#f0db4f',
      },
      error: red,
    },
  },
  light: {
    palette: {
      primary: {
        main: '#eeeeee',
      },
      secondary: {
        main: '#ffecb3',
      },
      error: red,
    },
  },
};

export default ({ children }) => {
  const { theme } = useContext(GlobalContext);
  const currentTheme = createMuiTheme(themes[theme]);
  return (
    <ThemeProvider theme={currentTheme}>
      {children}
    </ThemeProvider>
  );
};
