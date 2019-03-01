import React from 'react';
import PropTypes from 'prop-types';
import CodeEditor from './CodeEditor';
import PatternMenu from './PatternMenu';
import { FlexContainer, FlexItem } from '../../UI/Layout';

export default class CodeSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpened: false,
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.setEditorCode = this.setEditorCode.bind(this);
  }

  setEditorCode(code) {
    localStorage.setItem('currentCode', code);
    this.forceUpdate();
  }

  toggleMenu() {
    this.setState(prevState => ({ menuOpened: !prevState.menuOpened }));
  }


  render() {
    const { menuOpened } = this.state;
    const {
      onWidthChange, visualise, redraw, clearLines,
    } = this.props;
    return (
      <FlexContainer column height="100%">
        <FlexItem basis={menuOpened ? 15 : 0}>
          <PatternMenu
            toggle={this.toggleMenu}
            setEditorCode={code => this.setEditorCode(code)}
          />
        </FlexItem>
        <FlexItem grow={1}>
          <CodeEditor
            toggleMenu={this.toggleMenu}
            onWidthChange={onWidthChange}
            visualise={visualise}
            redraw={redraw}
            clearLines={clearLines}
          />
        </FlexItem>
      </FlexContainer>
    );
  }
}

CodeSection.propTypes = {
  onWidthChange: PropTypes.func.isRequired,
  visualise: PropTypes.func.isRequired,
};
