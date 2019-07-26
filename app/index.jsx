import React, { useContext, Fragment } from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider } from '@material-ui/styles';

import './AppStyle/index.scss';
import {
  AppLogo, AppNavbar, ToggleThemeBtn, CodeEditorSectionLayout, VisualisationSectionLayout,
} from './AppUI';
import ThemeProvider from './AppStyle/StyleThemeProvider';
import GlobalStateProvider, { GlobalContext } from './GlobalContextProvider';
import CodeSection from './Components/CodeSection';
import MemoryVisualisation from './Components/MemoryVisualisation';

const App = () => {
  const { toggleTheme } = useContext(GlobalContext);
  return (
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
  );
};

ReactDOM.render(
  <StylesProvider injectFirst>
    <CssBaseline />
    <GlobalStateProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </GlobalStateProvider>
  </StylesProvider>,
  document.getElementById('react-app'),
);

export default App;
