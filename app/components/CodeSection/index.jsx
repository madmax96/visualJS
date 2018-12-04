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
  }

  toggleMenu() {
    this.setState(prevState => ({ menuOpened: !prevState.menuOpened }));
  }

  render() {
    const { menuOpened } = this.state;
    const {
      onWidthChange, onCodeChange, code, visualise,
    } = this.props;
    return (
      <FlexContainer column height={100}>
        <FlexItem basis={menuOpened ? 15 : 0}>
          <PatternMenu
            toggle={this.toggleMenu}
            setEditorCode={this.props.onCodeChange}
          />
        </FlexItem>
        <FlexItem grow={1}>
          <CodeEditor
            code={code}
            toggleMenu={this.toggleMenu}
            onWidthChange={onWidthChange}
            onCodeChange={onCodeChange}
            visualise={visualise}
          />
        </FlexItem>
      </FlexContainer>
    );
  }
}

CodeSection.propTypes = {
  onWidthChange: PropTypes.func.isRequired,
  onCodeChange: PropTypes.func.isRequired,
  visualise: PropTypes.func.isRequired,
  code: PropTypes.string.isRequired,
};
