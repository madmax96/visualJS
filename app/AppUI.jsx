import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import HighlightIcon from '@material-ui/icons/Highlight';
import jsLogo from '../public/img/jsSVG.svg';
import { FlexContainer, FlexItem, CommonUI } from './Shared/UIComponents/LayoutGrid/Layout';

const styles = theme => ({

  highlightIcon: {
    fontSize: 35,
    fill: theme.palette.primary.light,
    '&:hover': {
      fill: theme.palette.primary.dark,
    },
  },
  appLogo: {
    width: 40,
    marginRight: 'auto',
    cursor: 'pointer',
  },
  codeEditorLayoutSection: {
    backgroundColor: theme.palette.primary.dark,
  },
  codeEditorLayoutSectionBox: {
    boxShadow: theme.shadows[20],
  },
});
export const ToggleThemeBtn = withStyles(styles)(({ classes, ...otherProps }) => (
  <IconButton {...otherProps}>
    <HighlightIcon className={classes.highlightIcon} />
  </IconButton>
));

export const AppNavbar = (({ children }) => (
  <AppBar position="static" color="secondary">
    <Toolbar>
      {children}
    </Toolbar>
  </AppBar>
));

export const AppLogo = withStyles(styles)(({ classes }) => <img src={jsLogo} alt="App Logo" className={classes.appLogo} />);

export const CodeEditorSectionLayout = withStyles(styles)(({ children, classes }) => (
  <FlexContainer width="100%" height="100vh" justify_content="center" align_items="center" className={classes.codeEditorLayoutSection}>
    <FlexItem height="80%" basis={90} className={classes.codeEditorLayoutSectionBox}>
      {children}
    </FlexItem>
  </FlexContainer>
));

export const VisualisationSectionLayout = (({ children }) => (<CommonUI width="100%">{children}</CommonUI>));
