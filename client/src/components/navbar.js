import React from 'react';
import { ViewRow } from './';
import { Link } from 'react-router-dom';

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '3rem',
    borderBottom: '1px solid rgba(34, 36, 38, 0.1)'
  },
  header: {
    fontWeight: 700,
    marginLeft: '1rem'
  },
  logout: {
    marginRight: '1rem'
  }
};


const NavBar = () => (
  <ViewRow style={styles.container}>
    <h3 style={styles.header}>CHC Alpha</h3>
    <Link style={styles.logout} to="/login">Logout</Link>
  </ViewRow>
);

export default NavBar;
