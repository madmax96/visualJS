import React, {
  useEffect, useRef, useState, useContext,
} from 'react';
import PropTypes from 'prop-types';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import { GlobalContext } from '../../../GlobalContextProvider';
import {
  LayoutContainer, ButtonsContainer, VisualiseButton, ClearEditorButton,
} from './CodeEditorUI';
// this component is uncontrolled, but it can receive `code` prop,
// which is a value to set as editor's value..
const CodeEditor = ({ code, clearCode }) => {
  const codeTextarea = useRef();
  const [editor, setEditor] = useState(null);
  const { setCode } = useContext(GlobalContext);
  useEffect(() => {
    const CMEditor = CodeMirror.fromTextArea(codeTextarea.current, {
      lineNumbers: true,
      theme: 'material',
      mode: 'javascript',
    });
    CMEditor.on('change', () => {
      localStorage.setItem('code', CMEditor.getValue());
    });
    const storedCode = localStorage.getItem('code');
    if (storedCode) {
      CMEditor.setValue(storedCode);
    }
    setEditor(CMEditor);
  }, []);
  useEffect(() => {
    // if component received code prop it must set that value as editor's value.
    if (code !== null) {
      editor.setValue(code);
      /* We should clear parent's code value
       * to avoid setting the same value again in subsequent renders,
       * and possibly override what user has typed.
      */
      clearCode();
    }
  });

  return (
    <LayoutContainer>
      <ButtonsContainer>
        <ClearEditorButton onClick={() => editor.setValue('')} />
        <VisualiseButton onClick={() => setCode(editor.getValue())} />
      </ButtonsContainer>
      {<textarea name="code" ref={codeTextarea} />}
    </LayoutContainer>
  );
};

CodeEditor.propTypes = {
  code: PropTypes.string,
  clearCode: PropTypes.func.isRequired,
};

export default CodeEditor;
