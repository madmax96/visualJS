import React from 'react';
import CodeEditor from './CodeEditor';
import PatternMenu from './PatternMenu';
import { FlexContainer, FlexItem } from '../../UI/Layout';

export default class CodeSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpened: false,
      editorCode: '',
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  setEditorCode(code) {
    this.setState({ editorCode: code });
  }

  toggleMenu() {
    this.setState(prevState => ({ menuOpened: !prevState.menuOpened }));
  }

  render() {
    const { menuOpened, editorCode } = this.state;
    return (
      <FlexContainer column height={100}>
        <FlexItem basis={menuOpened ? 15 : 0}>
          <PatternMenu
            toggle={this.toggleMenu}
            setEditorCode={code => this.setEditorCode(code)}
          />
        </FlexItem>
        <FlexItem grow={1}>
          <CodeEditor
            code={editorCode}
            toggleMenu={this.toggleMenu}
            onWidthChange={this.props.onWidthChange}
            setEditorCode={code => this.setEditorCode(code)}
          />
        </FlexItem>
      </FlexContainer>
    );
  }
}
