import React from 'react';
import ReactDOM from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCoffee, faBars, faCogs, faReceipt,
} from '@fortawesome/free-solid-svg-icons';
import 'normalize.css/normalize.css';
import './app.css';
import CodeSection from './components/CodeSection/index';
import {
  FlexContainer, FlexItem, Common,
} from './UI/Layout';
import VisualisationSection from './components/VisualisationSection/index';
import SideMenu from './components/SideMenu';
import AppNavbar from './components/AppNavbar';
import { JS_INTERNALS_TO_VISUALISE } from './config';
import createGraphFromObjects from './utils/createGraphFromObjects';
import removeAllDOMChildNodes from './utils/removeAllDOMChildNodes';
import replaceLetConst from './utils/replaceLetConst';
import { isReferenceType } from './utils/validation';

library.add(faCoffee, faBars, faCogs, faReceipt);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      memoryGraph: null,
      globals: null,
    };
    this.section = React.createRef();
    this.frame = React.createRef();
    this.visualise = this.visualise.bind(this);
    // this.changeWidth = this.changeWidth.bind(this);
    // this.redraw = this.redraw.bind(this);
    // this.clearLines = this.clearLines.bind(this);
    // this.setSvgLinesContainerNode = this.setSvgLinesContainerNode.bind(this);
    // this.svgLinesContainerNode = null;
    this.defaultGlobals = null;
  }

  componentDidMount() {
    const global = this.frame.current.contentWindow;
    this.defaultGlobals = Object.getOwnPropertyNames(global);
    this.internalGlobals = { Math: global.Math };
    localStorage.setItem('currentCode', ' ');
  }

  // setSvgLinesContainerNode(node) {
  //   this.svgLinesContainerNode = node;
  // }

  visualise() {
    const code = localStorage.getItem('currentCode');
    const global = this.frame.current.contentWindow;
    try {
      // first evaluation to check for errors
      global.eval(code);
    } catch (e) {
      return this.setState({ error: e.message });
    }
    /* replace all let and const declarations with var
     var declarations are available on global object */

    const codeToExecute = replaceLetConst(code);
    global.eval(codeToExecute);
    const newGlobals = Object.getOwnPropertyNames(global);
    const newProps = newGlobals
      .filter(prop => !this.defaultGlobals.includes(prop));

    const objects = [];
    const globals = {};

    newProps.forEach((key) => {
      if (isReferenceType(global[key])) {
        objects.push(global[key]);
      }
      globals[key] = global[key];
    });

    const internalObjects = JS_INTERNALS_TO_VISUALISE.map(key => global[key]);
    const memoryGraph = createGraphFromObjects([...internalObjects, ...objects]);

    this.setState({
      memoryGraph, globals,
    });
    newProps.forEach((key) => {
      delete global[key];
    });
  }

  // redraw() {
  //   this.forceUpdate();
  // }

  // clearLines() {
  //   removeAllDOMChildNodes(this.svgLinesContainerNode);
  // }


  // changeWidth(newWidth) {
  //   this.section.current.style['flex-basis'] = `${newWidth}%`;
  // }

  render() {
    const {
      error, internalsGraph, memoryGraph, globals,
    } = this.state;
    return (
      <div>
        <Common dNone>
          <iframe src="" frameBorder="0" ref={this.frame} title="iframe" />
        </Common>
        <Common height="8vh">
          <AppNavbar />
        </Common>
        <FlexContainer height="92vh">
          <FlexItem basis={15}>
            <SideMenu />
          </FlexItem>
          <FlexItem basis={85} height="100%" ref={this.section}>
            <CodeSection
              visualise={this.visualise}
              onWidthChange={newWidth => this.changeWidth(newWidth)}
              redraw={this.redraw}
              clearLines={this.clearLines}
            />
          </FlexItem>

        </FlexContainer>

        <VisualisationSection
          internalsGraph={internalsGraph}
          memoryGraph={memoryGraph}
          globals={globals}
          internalGlobals={this.internalGlobals}
          redraw={this.redraw}
          setSvgLinesContainerNode={this.setSvgLinesContainerNode}
          clearLines={this.clearLines}
        />

      </div>
    );
  }
}
ReactDOM.render(
  <App />,
  document.getElementById('react-app'),
);

export default App;
