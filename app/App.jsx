import React, { useContext, Fragment } from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css/normalize.css';
import './AppStyle/index.scss';
import {
  AppLogo, AppNavbar, ToggleThemeBtn, CodeEditorSectionLayout, VisualisationSectionLayout,
} from './AppUI';
import ThemeProvider from './AppStyle/ThemeProvider';
import GlobalStateProvider, { GlobalStateContext } from './GlobalStateProvider';
import CodeSection from './Components/CodeSection';
import MemoryVisualisation from './Components/MemoryVisualisation';

const App = () => {
  const { toggleTheme } = useContext(GlobalStateContext);
  return (
    <ThemeProvider>
      <Fragment>
        <AppNavbar>
          <AppLogo />
          <ToggleThemeBtn onClick={toggleTheme} />
        </AppNavbar>
        <CodeEditorSectionLayout>
          <CodeSection />
        </CodeEditorSectionLayout>
        <VisualisationSectionLayout>
          <MemoryVisualisation />
        </VisualisationSectionLayout>
      </Fragment>
    </ThemeProvider>
  );
};

ReactDOM.render(
  <GlobalStateProvider>
    <App />
  </GlobalStateProvider>,
  document.getElementById('react-app'),
);

export default App;
