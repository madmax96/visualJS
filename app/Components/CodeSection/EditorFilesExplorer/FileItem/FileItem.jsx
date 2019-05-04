import React from 'react';
import PropTypes from 'prop-types';
import FileItemUI from './FileItemUI';

const FileItem = ({ code, name, setCode }) => (
  <FileItemUI filename={name} onClick={() => setCode(code)} />
);

FileItem.propTypes = {
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  setCode: PropTypes.func.isRequired,
};

export default FileItem;
