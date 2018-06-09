import React from 'react';

const styles = {
  viewRow: {
    display: 'flex',
    flexFlow: 'row'
  },
  viewCol: {
    display: 'flex',
    flexFlow: 'column'
  }
};


export const ViewRow = ({ style, children, className }) => (
  <div className={className || ''} style={{ ...styles.viewRow, ...style }}>
    {children}
  </div>
);


export const ViewCol = ({ style, children, className, onScroll, id }) => (
  <div
    id={id}
    className={className || ''}
    style={{ ...styles.viewCol, ...style }}
    onScroll={onScroll}
  >
    {children}
  </div>
);