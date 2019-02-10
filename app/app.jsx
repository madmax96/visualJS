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
import createGraphFromObjects from './utils/graphFromObjects';
import replaceLetConst from './utils/replaceLetConst';
import { isReferenceType } from './utils/validation';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      code: '',
      internalsGraph: null,
      memoryGraph: null,
      globals: null,
    };
    this.section = React.createRef();
    this.frame = React.createRef();
    this.visualise = this.visualise.bind(this);
    this.toogleEditor = this.toogleEditor.bind(this);
    this.changeWidth = this.changeWidth.bind(this);
    this.setCode = this.setCode.bind(this);
    this.visualise = this.visualise.bind(this);
    this.redraw = this.redraw.bind(this);

    this.defaultGlobals = null;
  }

  componentDidMount() {
    const global = this.frame.current.contentWindow;
    this.defaultGlobals = Object.getOwnPropertyNames(global);
    const internalsGraph = createGraphFromObjects(JS_INTERNALS_TO_VISUALISE
      .map(key => global[key]));
    this.internalGlobals = { Math: global.Math };
    this.setState({ internalsGraph });
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
    const global = this.frame.current.contentWindow;
    try {
      // first evaluation to check for errors
      global.eval(this.state.code);
    } catch (e) {
      return this.setState({ error: e.message });
    }
    /* replace all let and const declarations with var
     var declarations are available on global object */

    const codeToExecute = replaceLetConst(this.state.code);
    global.eval(codeToExecute);
    const newGlobals = Object.getOwnPropertyNames(global);
    const newProps = newGlobals
      .filter(prop => !this.defaultGlobals.includes(prop));

    // we need to re-visualise internals becouse user script can change them
    const internalsGraph = createGraphFromObjects(JS_INTERNALS_TO_VISUALISE
      .map(key => global[key]));

    // first filter to only pass reference values
    // create separate map for key value for references on global object
    const objects = [];
    const globals = {};
    newProps.forEach((key) => {
      if (isReferenceType(global[key])) {
        objects.push(global[key]);
      }
      globals[key] = global[key];
    });
    const memoryGraph = createGraphFromObjects(objects, internalsGraph.V);

    this.setState({ memoryGraph, internalsGraph, globals });
    newProps.forEach((key) => {
      delete global[key];
    });
  }

  redraw() {
    this.forceUpdate();
  }

  render() {
    const {
      error, code, internalsGraph, memoryGraph, globals,
    } = this.state;
    return (
      <AppContainer>
        <Common dNone>
          <iframe src="" frameBorder="0" ref={this.frame} title="iframe" />
        </Common>
        <FlexContainer height={100}>
          <FlexItem basis={10} ref={this.section}>
            <CodeSection
              visualise={this.visualise}
              onWidthChange={newWidth => this.changeWidth(newWidth)}
              onCodeChange={code => this.setCode(code)}
              code={code}
            />
          </FlexItem>
          <FlexItem grow={1} shrink={1}>
            <VisualisationSection
              internalsGraph={internalsGraph}
              memoryGraph={memoryGraph}
              globals={globals}
              internalGlobals={this.internalGlobals}
              redraw={this.redraw}
            />
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
