import React, { useState } from 'react';

const RadialMenu = ({ setDay, setWeek, setPhase }) => {
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
        <li onClick={() => setWeek(1)} className='menu-item'>
          <div>W1</div>
        </li>
        <li onClick={() => setWeek(2)} className='menu-item'>
          <div>W2</div>
        </li>
        <li onClick={() => setWeek(3)} className='menu-item'>
          <div>W3</div>
        </li>
        <li onClick={() => setWeek(4)} className='menu-item'>
          <div>W4</div>
        </li>
        {/* <li onClick={() => setPhase(1)} className='menu-item'>
          <div>P1</div>
        </li>
        <li onClick={() => setPhase(2)} className='menu-item'>
          <div>P2</div>
        </li>
        <li onClick={() => setPhase(3)} className='menu-item'>
          <div>P3</div>
        </li> */}
      </ul>
    </>
  );
};

export default RadialMenu;
