import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ipoActions from '../actions/actioncreators';

class IpoWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{height: '100%' }}>
        <h1>Hello world! IPO</h1>
        <p style={{ color: 'white'}}>{this.props.testState}</p>
        <button onClick={() => this.props.testAction('funny bear')}>Click Me!</button>
      </div>
    )
  }
}

const mapStateToProps = ({ Ipo }) => {
  return {
    testState: Ipo.tree
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({...ipoActions}, dispatch);
};

const Ipo = connect(mapStateToProps, mapDispatchToProps)(IpoWrapper);

export default Ipo;
