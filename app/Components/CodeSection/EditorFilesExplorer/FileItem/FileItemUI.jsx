import React from 'react';
import { styled } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import JSLogo from '../../../../../public/img/jsSVG.svg';

const Container = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
}), { withTheme: true });

const JsLogo = styled('img')({
  width: '20px',
  height: '20px',
  marginRight: '10px',
});

export default (({ filename, ...otherProps }) => (
  <Container display="flex" p={1} {...otherProps}>
    <JsLogo src={JSLogo} alt="jsLogo" />
    <Box variant="span" color="secondary.main" fontWeight="fontWeightBold">
      {filename}
      .js
    </Box>
  </Container>
));
