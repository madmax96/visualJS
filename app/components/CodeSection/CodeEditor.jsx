import React from 'react';
import PropTypes from 'prop-types';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import {
  FlexContainer, Position, Common,
} from '../../UI/Layout';
import ToggleMenuButton from '../../UI/components/ToggleMenuButton';
import ClearButton from '../../UI/components/ClearButton';
import ResizeButton from '../../UI/components/ResizeButton';


import { replaceLetConst, getPrototypeTree } from '../../utils';

class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    // Iframe creates new global object which will be used as a sandbox to execude code in it
    this.codeTextarea = React.createRef();
    this.frame = React.createRef();
    this.executeCode = this.executeCode.bind(this);
    this.setMousemoveHandler = this.setMousemoveHandler.bind(this);
    this.editor = null;
  }

  componentDidMount() {
    this.editor = CodeMirror.fromTextArea(this.codeTextarea.current, {
      lineNumbers: true,
      theme: 'material',
      mode: 'javascript',
    });
    const frame = this.frame.current;
    this.defaultGlobals = Object.getOwnPropertyNames(frame.contentWindow);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.code !== undefined) this.editor.setValue(nextProps.code);
    return true;
  }

  setMousemoveHandler(e) {
    window.onmousemove = (e) => {
      const newWidth = Math.min(Math.round((e.clientX / window.innerWidth) * 100), 50);
      // alert(newWidth);
      this.props.onWidthChange(newWidth);
    };
    window.onmouseup = function onmouseup() {
      window.onmousemove = null;
      window.onmouseup = null;
    };
    e.preventDefault(); // to prevent selection of text
  }

  executeCode() {
    const frame = this.frame.current;
    try {
      // first evaluation to check for errors
      frame.contentWindow.eval(this.editor.getValue());
    } catch (e) {
      return this.props.onCodeError(e.message);
    }
    /* replace all let and const declarations with var
     var declarations are available on global object */

    const codeToExecute = replaceLetConst(this.editor.getValue());
    frame.contentWindow.eval(codeToExecute);

    const newGlobals = Object.getOwnPropertyNames(frame.contentWindow);
    const newProps = newGlobals
      .filter(prop => !this.defaultGlobals.includes(prop));

    const prototypeMap = new Map();
    newProps.forEach((prop) => {
      prototypeMap.set(frame.contentWindow[prop],
        frame.contentWindow.Object.getPrototypeOf(frame.contentWindow[prop]));
      delete frame.contentWindow[prop];
    });
    // const tree = getPrototypeTree(memory);
    this.props.visualise(prototypeMap);
  }


  render() {
    return (
      <FlexContainer height={100} relative>
        <Common dNone>
          <iframe src="" frameBorder="0" ref={this.frame} title="iframe" />
        </Common>
        <Position absolute right="1%" top="1%" zIndex={1000}>
          <FlexContainer>
            <ClearButton onClick={() => this.props.setEditorCode(' ')} />
            <ToggleMenuButton onClick={this.props.toggleMenu} />
          </FlexContainer>
        </Position>
        <Position absolute right={0} top="50%" zIndex={1000}>
          <ResizeButton onMouseDown={this.setMousemoveHandler} />
        </Position>
        <textarea name="code" ref={this.codeTextarea} />
      </FlexContainer>
    );
  }
}

CodeEditor.propTypes = {
  visualise: PropTypes.func.isRequired,
  onCodeError: PropTypes.func.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  setEditorCode: PropTypes.func.isRequired,
  code: PropTypes.string,
};

export default CodeEditor;
