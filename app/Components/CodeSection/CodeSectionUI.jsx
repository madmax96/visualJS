import React from 'react';
import Box from '@material-ui/core/Box';

export const LayoutContainer = ({ children }) => <Box display="flex" height="100%">{children}</Box>;
export const LayoutSidebar = ({ children }) => <Box flexBasis="15%">{children}</Box>;
export const LayoutMain = ({ children }) => <Box flexGrow={1}>{children}</Box>;
