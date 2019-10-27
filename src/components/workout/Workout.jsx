import React, { useState } from 'react';
import { dayOne, dayTwo, dayThree, dayFour } from '../../data/workoutPrograms';
import RadialMenu from '../layout/RadialMenu';

const Workout = () => {
  const [day, setDay] = useState(1);

  return (
    <>
      <Table
        data={
          day === 1
            ? dayOne
            : day === 2
            ? dayTwo
            : day === 3
            ? dayThree
            : dayFour
        }
      />
      <RadialMenu setDay={setDay} />
    </>
  );
};

const Table = ({ data }) => {
  return (
    <main className='table'>
      <h1>{data.title}</h1>
      <div className='table-container'>
        <div className='row title-row'>
          {data.titleRow.map((r, i) => (
            <div key={i} className='cell'>
              {r}
            </div>
          ))}
        </div>
        <div className='row'>
          {data.rows.wOne.map((r, i) => (
            <div key={i} className='cell'>
              {r}
            </div>
          ))}
        </div>
        <div className='row'>
          {data.rows.wTwo.map((r, i) => (
            <div key={i} className='cell'>
              {r}
            </div>
          ))}
        </div>
        <div className='row'>
          {data.rows.wThree.map((r, i) => (
            <div key={i} className='cell'>
              {r}
            </div>
          ))}
        </div>
        <div className='row'>
          {data.rows.wFour.map((r, i) => (
            <div key={i} className='cell'>
              {r}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Workout;
