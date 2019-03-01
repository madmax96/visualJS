import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppNavbar from '../UI/components/AppNavbar';
import jsLogo from '../../public/img/jsSVG.svg';

export default props => (
  <AppNavbar>
    <AppNavbar.FirstSection>
      <FontAwesomeIcon icon="bars" size="3x" color="red" />
    </AppNavbar.FirstSection>
    <AppNavbar.Logo src={jsLogo} alt="js logo" />
    <AppNavbar.ThirdSection>
      <FontAwesomeIcon icon="cogs" size="3x" color="red" />
      <span>Settings</span>
      <FontAwesomeIcon icon="receipt" size="3x" color="red" />
      <span>Legend</span>
    </AppNavbar.ThirdSection>
  </AppNavbar>
);
