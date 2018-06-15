import React from 'react';
import { ViewRow, ViewCol } from '../components';
import { PortfolioPanel } from '../containers';

const styles = {
  container: {
    height: '100%',
    width: '100%'
  },
  leftPanel: {
    border: '1px solid red',
    flex: '0.6'
  },
  rightPanel: {
    border: '1px solid blue',
    flex: '0.4'
  }
};


export default class Portfolio extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ViewRow style={styles.container}>
        <ViewCol style={styles.leftPanel}>
          <PortfolioPanel />
        </ViewCol>
        <ViewCol style={styles.rightPanel}>

        </ViewCol>
      </ViewRow>
    )
  }
}
