import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useFirestoreConnect, withFirebase } from 'react-redux-firebase';
import moment from 'moment';

import RadialMenu from '../layout/RadialMenu';
import Loading from '../layout/Loading';

const Workout = props => {
  const [user, setUser] = useState(false);
  const [day, setDay] = useState(1);
  const [week, setWeek] = useState(1);
  const [phase, setPhase] = useState(3);
  useFirestoreConnect('WORKOUT_PROGRAMS');

  useEffect(() => {
    const getData = () => {
      props.firebase.auth().onAuthStateChanged(async user => {
        if (user) {
          const idTokenResult = await user.getIdTokenResult();
          setUser(
            idTokenResult.claims.user || idTokenResult.claims.admin
              ? true
              : false
          );
        }
      });
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  if (user === false) {
    return <h1 className='admin-approval'>Awaiting Approval</h1>;
  }

  if (props.isLoaded && user) {
    let closestDate = Infinity;

    if (props.profile.weights) {
      const dates = Object.keys(props.profile.weights);

      dates.forEach(date => {
        const diff = moment().diff(date);

        if (diff < closestDate) {
          closestDate = date;
        }
      });
    }
    return (
      <>
        <Table
          data={data}
          profile={
            props.profile.weights
              ? props.profile.weights[closestDate]
              : { squat: 0, bench: 0, deadLift: 0 }
          }
          phase={phase}
          week={week}
          day={day}
        />
        <RadialMenu setDay={setDay} setWeek={setWeek} setPhase={setPhase} />
      </>
    );
  } else {
    return <Loading />;
  }
};

const Table = ({ data, profile, phase, week, day }) => {
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

export default compose(withFirebase, connect(mapStateToProps, null))(Workout);
