import React from 'react';
import { FlexContainer, FlexItem } from '../../Shared/UIComponents/LayoutGrid/Layout';

export const LayoutContainer = ({ children }) => <FlexContainer height="100%">{children}</FlexContainer>;
export const LayoutSidebar = ({ children }) => <FlexItem basis={15}>{children}</FlexItem>;
export const LayoutMain = ({ children }) => <FlexItem grow={1}>{children}</FlexItem>;
