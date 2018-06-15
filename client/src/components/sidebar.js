import React from 'react';
import { ViewCol } from './';
import history from '../utils/history';

const styles = {
  container: {
    height: '100%',
    width: '3rem'
  },
  button: {
    height: '3rem',
    width: '100%'
  }
};

const SideBtn = ({ children, to }) => (
  <button onClick={() => history.push(to)} style={styles.button}>
    {children}
  </button>
);

const SideBar = () => (
  <ViewCol style={styles.container}>
    <SideBtn to="/dashboard/portfolio">POR</SideBtn>
    <SideBtn to="/dashboard/ipo">IPO</SideBtn>
    <SideBtn to="/dashboard/stocks">STO</SideBtn>
    <SideBtn to="/dashboard/settings">SET</SideBtn>
  </ViewCol>
);

export default SideBar;
