import React from 'react';
import PropTypes from 'prop-types';
import { MyMenu } from '../../UI/components/MyMenu';
import { codes } from '../../config';
import CodeBox from './CodeBox';
import { FlexItem } from '../../UI/Layout';

const PatternMenu = ({ setEditorCode }) => (
  <MyMenu>
    {codes.map(code => (
      <FlexItem height={50} basis={20} key={code.patternName}>
        <CodeBox name={code.patternName} code={code.code} setEditorCode={setEditorCode} />
      </FlexItem>
    ))}
  </MyMenu>
);
PatternMenu.propTypes = {
  setEditorCode: PropTypes.func.isRequired,
};
export default PatternMenu;
