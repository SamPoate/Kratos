import React, { useState } from 'react';

const RadialMenu = ({ setDay }) => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      <ul id='menu' className={`${openMenu ? 'open' : ''}`}>
        {!openMenu ? (
          <div
            className='menu-button icon-plus'
            onClick={() => setOpenMenu(!openMenu)}
          >
            +
          </div>
        ) : (
          <div
            className='menu-button icon-minus'
            onClick={() => setOpenMenu(!openMenu)}
          >
            -
          </div>
        )}
        <li onClick={() => setDay(1)} className='menu-item'>
          <div>D1</div>
        </li>
        <li onClick={() => setDay(2)} className='menu-item'>
          <div>D2</div>
        </li>
        <li onClick={() => setDay(3)} className='menu-item'>
          <div>D3</div>
        </li>
        <li onClick={() => setDay(4)} className='menu-item'>
          <div>D4</div>
        </li>
      </ul>
    </>
  );
};

export default RadialMenu;
