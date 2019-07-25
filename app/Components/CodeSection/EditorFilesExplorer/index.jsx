import React from 'react';
import PropTypes from 'prop-types';
import { codes } from '../../../constants';
import FileItem from './FileItem';
import { LayoutContainer } from './EditorFilesExplorerUI';

const EditorFilesExplorer = ({ setCode }) => (
  <LayoutContainer>
    {codes.map(code => (
      <FileItem
        key={code.patternName}
        name={code.patternName}
        code={code.code}
        setCode={setCode}
      />
    ))}
  </LayoutContainer>
);

EditorFilesExplorer.propTypes = {
  setCode: PropTypes.func.isRequired,
};
export default EditorFilesExplorer;
