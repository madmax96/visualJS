import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayArrowIcon from '@material-ui/icons/PlayArrowSharp';
import { FlexContainer } from '../../../Shared/UIComponents/LayoutGrid/Layout';


export const LayoutContainer = ({ children }) => <FlexContainer height="100%" relative>{children}</FlexContainer>;
export const ButtonsContainer = ({ children }) => <FlexContainer absolute right="1%" top="1%" zIndex={1000}>{children}</FlexContainer>;
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
