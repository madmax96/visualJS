import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css/normalize.css';
import './app.css';
import CodeSection from './components/CodeSection/index';
import {
  AppContainer, FlexContainer, FlexItem, Common,
} from './UI/Layout';
import VisualisationSection from './components/VisualisationSection/index';

import { JS_INTERNALS_TO_VISUALISE } from './config';
import createGraphFromObjects from './utils/graphFromObject';
import replaceLetConst from './utils/replaceLetConst';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visualising: false,
      error: false,
      code: '',
    };
    this.section = React.createRef();
    this.frame = React.createRef();
    this.visualise = this.visualise.bind(this);
    this.toogleEditor = this.toogleEditor.bind(this);
    this.changeWidth = this.changeWidth.bind(this);
    this.setCode = this.setCode.bind(this);
    this.visualise = this.visualise.bind(this);
    this.defaultGlobals = null;
  }

  componentDidMount() {
    const global = this.frame.current.contentWindow;
    this.defaultGlobals = Object.getOwnPropertyNames(global);
    const internalsGraph = createGraphFromObjects(JS_INTERNALS_TO_VISUALISE
      .map(key => global[key]));
    console.log(internalsGraph);
  }

  setCode(code) {
    this.setState({ code });
  }

  toogleEditor() {
    this.setState(({ isEditorShown }) => ({ isEditorShown: !isEditorShown }));
  }

  changeWidth(newWidth) {
    this.section.current.style['flex-basis'] = `${newWidth}%`;
  }

  visualise() {
    this.setState({ visualising: true });
    const frame = this.frame.current;
    try {
      // first evaluation to check for errors
      frame.contentWindow.eval(this.state.code);
    } catch (e) {
      return this.setState({ visualising: false, error: e.message });
    }
    /* replace all let and const declarations with var
     var declarations are available on global object */

    const codeToExecute = replaceLetConst(this.state.code);
    frame.contentWindow.eval(codeToExecute);
    const newGlobals = Object.getOwnPropertyNames(frame.contentWindow);
    const newProps = newGlobals
      .filter(prop => !this.defaultGlobals.includes(prop));

    const memoryGraph = createGraphFromObjects(newProps
      .map(key => frame.contentWindow[key]));

    console.log(memoryGraph);
    newProps.forEach((key) => {
      delete frame.contentWindow[key];
    });
  }

  render() {
    const { visualising, error, code } = this.state;
    return (
      <AppContainer>
        <Common dNone>
          <iframe src="" frameBorder="0" ref={this.frame} title="iframe" />
        </Common>
        <FlexContainer height={100}>
          <FlexItem basis={50} innerRef={this.section}>
            <CodeSection
              visualise={prototypeMap => this.visualise(prototypeMap)}
              onWidthChange={newWidth => this.changeWidth(newWidth)}
              onCodeChange={code => this.setCode(code)}
              code={code}
            />
          </FlexItem>
          <FlexItem grow={1} shrink={1}>
            <VisualisationSection visualise={this.visualise} />
          </FlexItem>
        </FlexContainer>
      </AppContainer>
    );
  }
}
ReactDOM.render(
  <App />,
  document.getElementById('react-app'),
);

export default App;
