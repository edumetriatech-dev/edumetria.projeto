'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from './sidebar/Sidebar';

const MainLayout = ({ children }) => {
    return (
        <div className="flex flex-row overflow-x-hidden">
          <Sidebar/>
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;