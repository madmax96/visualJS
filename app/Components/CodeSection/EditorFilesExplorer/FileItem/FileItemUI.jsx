import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FlexContainer } from '../../../../Shared/UIComponents/LayoutGrid/Layout';
import JSLogo from '../../../../../public/img/jsSVG.svg';

const styles = theme => ({

  jsIcon: {
    width: '20px',
    height: '20px',
    marginRight: '10px',
  },
  fileName: {
    color: theme.palette.secondary.main,
    fontWeight: 'bold',
  },
  container: {
    cursor: 'pointer',
    padding: 4,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
});
export default withStyles(styles)(({ classes, filename, ...otherProps }) => (
  <FlexContainer {...otherProps} className={classes.container}>
    <img src={JSLogo} alt="jsLogo" className={classes.jsIcon} />
    <span className={classes.fileName}>
      {filename}
        .js
    </span>
  </FlexContainer>
));
