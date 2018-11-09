import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../UI/components/StartButton';


const StartButton = props => (
  <Button onClick={props.visualise}>
    Start magic
  </Button>
);

StartButton.propTypes = {
  visualise: PropTypes.func.isRequired,
};
export default StartButton;
