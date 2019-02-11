import React from 'react';
import PropTypes from 'prop-types';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import {
  FlexContainer,
} from '../../UI/Layout';
import ToggleMenuButton from '../../UI/components/ToggleMenuButton';
import ClearButton from '../../UI/components/ClearButton';
import ResizeButton from '../../UI/components/ResizeButton';
import StartButton from '../../UI/components/StartButton';

class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    // Iframe creates new global object which will be used as a sandbox to execude code in it
    this.codeTextarea = React.createRef();
    this.setMousemoveHandler = this.setMousemoveHandler.bind(this);
    this.startVisualisation = this.startVisualisation.bind(this);

    this.editor = null;
  }

  componentDidMount() {
    this.editor = CodeMirror.fromTextArea(this.codeTextarea.current, {
      lineNumbers: true,
      theme: 'material',
      mode: 'javascript',
    });
    this.editor.on('change', () => {
      localStorage.setItem('currentCode', this.editor.getValue());
    });
  }

  shouldComponentUpdate() {
    this.editor.setValue(localStorage.getItem('currentCode'));
    return true;
  }

  componentWillUnmount() {
    localStorage.setItem('currentCode', ' ');
  }

  setMousemoveHandler(e) {
    window.onmousemove = (e) => {
      const newWidth = Math.min(Math.round((e.clientX / window.innerWidth) * 100), 50);
      this.props.onWidthChange(newWidth);
    };
    window.onmouseup = function onmouseup() {
      window.onmousemove = null;
      window.onmouseup = null;
    };
    e.preventDefault(); // to prevent selection of text
  }

  startVisualisation() {
    this.props.visualise();
  }

  render() {
    const { toggleMenu } = this.props;
    return (
      <FlexContainer height={100} relative>
        <FlexContainer absolute right="1%" top="1%" zIndex={1000}>
          <ClearButton onClick={() => this.editor.setValue(' ')} />
          <ToggleMenuButton onClick={toggleMenu} />
          <StartButton onClick={this.startVisualisation} />

        </FlexContainer>
        <FlexContainer absolute right={0} top="50%" zIndex={1000}>
          <ResizeButton onMouseDown={this.setMousemoveHandler} />
        </FlexContainer>
        <textarea name="code" ref={this.codeTextarea} />
      </FlexContainer>
    );
  }
}

CodeEditor.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
  onWidthChange: PropTypes.func.isRequired,
  visualise: PropTypes.func.isRequired,
};

export default CodeEditor;
