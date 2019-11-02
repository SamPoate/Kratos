import React, { useState } from 'react';
import { connect } from 'react-redux';

import { dayOne, dayTwo, dayThree, dayFour } from '../../data/workoutPrograms';
import RadialMenu from '../layout/RadialMenu';
import Loading from '../layout/Loading';

const Workout = props => {
  const [day, setDay] = useState(1);

  if (props.isLoaded) {
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
          profile={props.profile}
        />
        <RadialMenu setDay={setDay} />
      </>
    );
  }
  return <Loading />;
};

const Table = ({ data, profile }) => {
  const calc = (i, data) => {
    if (i === 5) {
      const percent = parseInt(data[i - 1].slice(0, -1));
      const weight = (parseInt(profile.squat) / 100) * percent;

      return weight;
    }

    return i;
  };

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
              {r ? r : calc(i, data.rows.wOne)}
            </div>
          ))}
        </div>
        <div className='row'>
          {data.rows.wTwo.map((r, i) => (
            <div key={i} className='cell'>
              {r ? r : calc(i, data.rows.wTwo)}
            </div>
          ))}
        </div>
        <div className='row'>
          {data.rows.wThree.map((r, i) => (
            <div key={i} className='cell'>
              {r ? r : calc(i, data.rows.wThree)}
            </div>
          ))}
        </div>
        <div className='row'>
          {data.rows.wFour.map((r, i) => (
            <div key={i} className='cell'>
              {r ? r : calc(i, data.rows.wFour)}
            </div>
          ))}
        </div>
        {data.rows.wFive ? (
          <div className='row'>
            {data.rows.wFive.map((r, i) => (
              <div key={i} className='cell'>
                {r ? r : calc(i, data.rows.wFive)}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
};

const mapStateToProps = state => ({
  profile: state.firebase.profile,
  isLoaded: state.firebase.profile.isLoaded
});

export default connect(mapStateToProps)(Workout);
