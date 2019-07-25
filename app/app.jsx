import React, { useContext, Fragment } from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css/normalize.css';
import { StylesProvider } from '@material-ui/styles';

import './AppStyle/index.scss';
import {
  AppLogo, AppNavbar, ToggleThemeBtn, CodeEditorSectionLayout, VisualisationSectionLayout,
} from './AppUI';
import StyleThemeProvider from './AppStyle/StyleThemeProvider';
import GlobalStateProvider, { GlobalStateContext } from './GlobalStateProvider';
import CodeSection from './Components/CodeSection';
import MemoryVisualisation from './Components/MemoryVisualisation';

const App = () => {
  const { toggleTheme } = useContext(GlobalStateContext);
  return (
    <Fragment>
      <AppNavbar>
        <Fragment>
          <AppLogo />
          <ToggleThemeBtn onClick={toggleTheme} />
        </Fragment>
      </AppNavbar>
      <CodeEditorSectionLayout>
        <CodeSection />
      </CodeEditorSectionLayout>
      <VisualisationSectionLayout>
        <MemoryVisualisation />
      </VisualisationSectionLayout>
    </Fragment>
  );
};

ReactDOM.render(
  <StylesProvider injectFirst>
    <GlobalStateProvider>
      <StyleThemeProvider>
        <App />
      </StyleThemeProvider>
    </GlobalStateProvider>
  </StylesProvider>,
  document.getElementById('react-app'),
);

export default App;
