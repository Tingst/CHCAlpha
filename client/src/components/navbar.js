import React from 'react';
import { ViewRow } from './';
import { Link } from 'react-router-dom';

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '2rem',
    border: '1px solid blue'
  },
  header: {
    marginLeft: '1rem'
  },
  logout: {
    marginRight: '1rem'
  }
};


const NavBar = () => (
  <ViewRow style={styles.container}>
    <h3 style={styles.header}>CPSC 310 Project</h3>
    <Link style={styles.logout} to="/login">Logout</Link>
  </ViewRow>
);

export default NavBar;
