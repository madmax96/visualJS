import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import HighlightIcon from '@material-ui/icons/Highlight';
import jsLogo from '../public/img/jsSVG.svg';
import { FlexContainer, FlexItem, CommonUI } from './Shared/UIComponents/LayoutGrid/Layout';

const InternalHighlightIcon = styled(HighlightIcon, ({ theme }) => ({
  fontSize: 35,
  fill: theme.palette.primary.light,
  '&:hover': {
    fill: theme.palette.primary.dark,
  },
}), { withTheme: true });

const InternalAppLogo = styled('img', {
  width: 40,
  marginRight: 'auto',
  cursor: 'pointer',
});

const CodeEditorLayout = styled(FlexContainer, ({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
}), { withTheme: true });

export const ToggleThemeBtn = (props => (
  <IconButton {...props}>
    <InternalHighlightIcon />
  </IconButton>
));

export const AppNavbar = (({ children }) => (
  <AppBar position="static" color="secondary">
    <Toolbar>
      {children}
    </Toolbar>
  </AppBar>
));

export const AppLogo = () => (<InternalAppLogo src={jsLogo} alt="App Logo" />);

export const CodeEditorSectionLayout = (({ children }) => (
  <CodeEditorLayout width="100%" height="100vh" justify_content="center" align_items="center">
    <FlexItem height="80%" basis={90}>
      {children}
    </FlexItem>
  </CodeEditorLayout>
));

export const VisualisationSectionLayout = (({ children }) => (<CommonUI width="100%">{children}</CommonUI>));
