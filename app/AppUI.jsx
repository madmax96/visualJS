import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import HighlightIcon from '@material-ui/icons/Highlight';
import jsLogo from '../public/img/jsSVG.svg';

const InternalHighlightIcon = styled(HighlightIcon)(({ theme }) => ({
  fontSize: 35,
  fill: theme.palette.primary.light,
  '&:hover': {
    fill: theme.palette.primary.dark,
  },
}), { withTheme: true });

const InternalAppLogo = styled('img')({
  width: 40,
  marginRight: 'auto',
  cursor: 'pointer',
});

export const ToggleThemeBtn = props => (
  <IconButton {...props}>
    <InternalHighlightIcon />
  </IconButton>
);

export const AppNavbar = ({ children }) => (
  <AppBar position="static" color="secondary">
    <Toolbar>
      {children}
    </Toolbar>
  </AppBar>
);

export const AppLogo = () => <InternalAppLogo src={jsLogo} alt="App Logo" />;

export const CodeEditorSectionLayout = ({ children }) => (
  <Box width="100%" height="100vh" display="flex" justifyContent="center" alignItems="center" bgcolor="secondary.dark">
    <Box height="80%" flexBasis="90%">
      {children}
    </Box>
  </Box>
);

export const VisualisationSectionLayout = ({ children }) => <Box width="100%">{children}</Box>;
