import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem } from '../../UI/components/MyMenu';

const CodeBox = ({ code, name, setEditorCode }) => (
  <MenuItem onClick={() => setEditorCode(code)}>{name}</MenuItem>
);

CodeBox.propTypes = {
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  setEditorCode: PropTypes.func.isRequired,
};

export default CodeBox;
