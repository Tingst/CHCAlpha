import React from 'react';
import { ViewCol } from './';
import history from '../utils/history';

const styles = {
  container: {
    height: '100%',
    minWidth: '3.5rem',
    borderRight: '1px solid rgba(34, 36, 38, 0.1)'
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  tooltip: {
    position: 'absolute',
    left: '100%',
    padding: '0.25rem 0.5rem 0.25rem 0.5rem',
    marginLeft: '0.25rem',
    borderRadius: 5,
    boxShadow: '0 0 5px grey',
    backgroundColor: '#374255',
    color: 'white',
    zIndex: 99
  }
};

const icons = {
  portfolio: <i style={{margin: 0}} className="folder open icon" />,
  stocks: <i style={{margin: 0}} className="chart line icon" />,
  ipo: <i style={{margin: 0}} className="money bill alternate icon" />,
  account: <i style={{margin: 0}} className="user icon" />
};

class SideBtn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false
    };

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMouseEnter() {
    this.setState({hovered: true});
  }

  handleMouseLeave() {
    this.setState({hovered: false});
  }

  render() {
    return (
      <button
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={() => history.push(this.props.to)}
        style={styles.button}
        className={`sidebar-button ${this.props.isActive ? 'active' : ''}`}>
        {icons[this.props.type]}
        {this.state.hovered &&
          <p style={styles.tooltip}>
            {this.props.type.charAt(0).toUpperCase() + this.props.type.toLowerCase().substr(1)}
            </p>
        }
      </button>
    )
  }
}

export default class SideBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const path = history.location.pathname;

    return (
      <ViewCol style={styles.container}>
        <SideBtn
          to="/dashboard/portfolio"
          type="portfolio"
          isActive={path.includes('portfolio')}
        />
        <SideBtn
          to="/dashboard/stocks"
          type="stocks"
          isActive={path.includes('stocks')}
        />
        <SideBtn
          to="/dashboard/ipo"
          type="ipo"
          isActive={path.includes('ipo')}
        />
        <SideBtn
          to="/dashboard/settings"
          type="account"
          isActive={path.includes('settings')}
        />
      </ViewCol>
    )
  }
}

