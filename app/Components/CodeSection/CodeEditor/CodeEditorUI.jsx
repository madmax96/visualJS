import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayArrowIcon from '@material-ui/icons/PlayArrowSharp';
import Box from '@material-ui/core/Box';

export const LayoutContainer = ({ children }) => <Box height="100%" position="relative">{children}</Box>;
export const ButtonsContainer = ({ children }) => <Box position="absolute" right="1%" top="1%" zIndex={1000}>{children}</Box>;
export const ClearEditorButton = props => (
  <IconButton {...props}>
    <DeleteIcon />
  </IconButton>
);

export const VisualiseButton = props => (
  <IconButton {...props}>
    <PlayArrowIcon />
  </IconButton>
);
