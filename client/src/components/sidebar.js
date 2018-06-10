import React from 'react';
import { ViewCol } from './';

const styles = {
  container: {
    height: '100%',
    width: '2rem',
    border: '1px solid red'
  }
};

const SideBar = () => (
  <ViewCol style={styles.container}>
  </ViewCol>
);

export default SideBar;
