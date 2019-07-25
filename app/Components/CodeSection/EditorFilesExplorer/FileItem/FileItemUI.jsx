import React from 'react';
import { styled } from '@material-ui/styles';
import { FlexContainer } from '../../../../Shared/UIComponents/LayoutGrid/Layout';
import JSLogo from '../../../../../public/img/jsSVG.svg';

const FileName = styled('span')(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontWeight: 'bold',
}), { withTheme: true });

const Container = styled(FlexContainer)(({ theme }) => ({
  cursor: 'pointer',
  padding: 4,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}), { withTheme: true });

const JsLogo = styled('img')({
  width: '20px',
  height: '20px',
  marginRight: '10px',
});

export default (({ filename, ...otherProps }) => (
  <Container {...otherProps}>
    <JsLogo src={JSLogo} alt="jsLogo" />
    <FileName>
      {filename}
      .js
    </FileName>
  </Container>
));
