import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { updateTotalVolume } from '../../redux/actions/profileActions';

import RadialMenu from '../layout/RadialMenu';
import Loading from '../layout/Loading';

const Workout = props => {
  const [day, setDay] = useState(1);
  const [week, setWeek] = useState(1);
  const [phase, setPhase] = useState(1);
  useFirestoreConnect('WORKOUT_PROGRAMS');

  const dict = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four'
  };

  let data;
  if (props.data) {
    const defaultPhase = 'PHASE_ONE';
    const phaseConvert = `phase_${dict[phase]}`.toUpperCase();
    const weekConvert = `week_${dict[week]}`;
    const dayConvert = `day_${dict[day]}`;

    data = props.data[phaseConvert]
      ? props.data[phaseConvert][weekConvert][dayConvert]
      : props.data[defaultPhase][weekConvert][dayConvert];
  }

  if (props.isLoaded) {
    return (
      <>
        <Table
          data={data}
          profile={props.profile}
          phase={phase}
          week={week}
          day={day}
          updateTotalVolume={props.updateTotalVolume}
        />
        <RadialMenu setDay={setDay} setWeek={setWeek} setPhase={setPhase} />
      </>
    );
  }
  return <Loading />;
};

const Table = ({ data, profile, phase, week, day, updateTotalVolume }) => {
  const titleRow = [
    'Workout Name',
    'Sets',
    'Reps',
    'Total',
    '%',
    'Weight/RPE',
    'Volume (kg)'
  ];

  const calcWeight = data => {
    if (data.weight) return data.weight;
    let workoutType;
    if (data.name.toLowerCase().includes('squat')) {
      workoutType = 'squat';
    } else if (data.name.toLowerCase().includes('bench')) {
      workoutType = 'bench';
    } else if (data.name.toLowerCase().includes('deadlift')) {
      workoutType = 'deadLift';
    } else {
      return '';
    }

    const percent = parseInt(data.percent);
    const weight = (parseInt(profile[workoutType]) / 100) * percent;
    data.weight = weight;
    data.type = workoutType;

    const formattedWeight = parseFloat(weight.toFixed(2));
    return formattedWeight;
  };

  const calcVolume = data => {
    const total = data.weight * data.total;

    const reduxObj = {
      type: data.type,
      volume: parseFloat(total.toFixed(2))
    };

    total && updateTotalVolume(reduxObj);

    return total ? parseFloat(total.toFixed(2)) : '';
  };

  if (!data) {
    return <Loading />;
  }

  return (
    <main className='table'>
      <h1>
        Phase {phase} - Week {week} - Day {day}
      </h1>
      <div className='table-container'>
        <div className='row title-row'>
          {titleRow.map((r, i) => (
            <div key={i} className='cell'>
              {r}
            </div>
          ))}
        </div>
        {data.map((r, i) => (
          <div key={i} className='row'>
            <div className='cell'>{r.name}</div>
            <div className='cell'>{r.sets}</div>
            <div className='cell'>{r.reps}</div>
            <div className='cell'>{r.total}</div>
            <div className='cell'>{r.percent}</div>
            <div className='cell'>{calcWeight(r)}</div>
            <div className='cell'>{calcVolume(r)}</div>
          </div>
        ))}
      </div>
    </main>
  );
};

const mapStateToProps = state => ({
  profile: state.firebase.profile,
  isLoaded: state.firebase.profile.isLoaded,
  data: state.firestore.data.WORKOUT_PROGRAMS
});

export default compose(
  connect(
    mapStateToProps,
    { updateTotalVolume }
  )
)(Workout);
