import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css/normalize.css';
import './app.css';
import CodeSection from './components/CodeSection/index';
import {
  AppContainer, FlexContainer, FlexItem,
} from './UI/Layout';
import VisualisationSection from './components/VisualisationSection/index';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visualising: false,
    };
    this.section = React.createRef();
    this.visualise = this.visualise.bind(this);
    this.toogleEditor = this.toogleEditor.bind(this);
    this.changeWidth = this.changeWidth.bind(this);
  }

  visualise(prototypeMap) {
    console.log(prototypeMap);
    this.setState({ visualising: true });
  }

  toogleEditor() {
    this.setState(({ isEditorShown }) => ({ isEditorShown: !isEditorShown }));
  }

  changeWidth(newWidth) {
    this.section.current.style['flex-basis'] = `${newWidth}%`;
  }

  render() {
    const { visualising } = this.state;
    return (
      <AppContainer>
        <FlexContainer height={100}>
          <FlexItem basis={50} innerRef={this.section}>
            <CodeSection
              visualise={prototypeMap => this.visualise(prototypeMap)}
              onWidthChange={newWidth => this.changeWidth(newWidth)}
            />
          </FlexItem>
          <FlexItem grow={1} shrink={1}>
            <VisualisationSection />
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
