import React from 'react';

const RadialMenu = ({ setDay }) => {
  return (
    <>
      <ul id='menu'>
        {/* eslint-disable-next-line */}
        <a
          className='menu-button icon-plus'
          href='#menu'
          title='Show navigation'
        >
          +
        </a>
        {/* eslint-disable-next-line */}
        <a className='menu-button icon-minus' href='#0' title='Hide navigation'>
          -
        </a>
        <li onClick={() => setDay(1)} className='menu-item'>
          <a href='#menu'>D1</a>
        </li>
        <li onClick={() => setDay(2)} className='menu-item'>
          <a href='#menu'>D2</a>
        </li>
        <li onClick={() => setDay(3)} className='menu-item'>
          <a href='#menu'>D3</a>
        </li>
        <li onClick={() => setDay(4)} className='menu-item'>
          <a href='#menu'>D4</a>
        </li>
      </ul>
    </>
  );
};

export default RadialMenu;
