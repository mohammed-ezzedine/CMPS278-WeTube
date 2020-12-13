// import { Icon } from '@material-ui/core';
import React from 'react';
import './SidebarRow.css';
import { Link } from 'react-router-dom';

function SidebarRow({ Icon, title, pageLink }) {
  const pathName = window.location.pathname.slice(1);
  return (
    <Link
      to={`/${pageLink}`}
      className={`sidebarRow ${pathName == pageLink ? 'selected' : ''}`}
    >
      <Icon className="sidebarRow__icon" />
      <h2 className="sidebarRow__title">{title}</h2>
    </Link>
  );
}

export default SidebarRow;
