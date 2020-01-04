import React, { useState, useEffect } from 'react';
import CSVReader from 'react-csv-reader';
import { useFirestore } from 'react-redux-firebase';
import update from 'immutability-helper';
import { uuid } from 'uuidv4';
import { Dropdown, Icon } from 'semantic-ui-react';
import { capitalize } from '../../helpers/formatters';

const WorkoutCreator = () => {
  const [workoutData, setWorkoutData] = useState({});
  const [completed, setCompleted] = useState('');
  const [phase, setPhase] = useState('PHASE_ONE');
  const [day, setDay] = useState('1');
  const [week, setWeek] = useState('1');
  const firestore = useFirestore();
  const dict = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven'
  };

  const handleFile = file => {
    let csvDay = '';
    let csvWeek = '';
    const data = file.reduce((data, row) => {
      if (!row[0]) {
        return data;
      }

      if (row[0].includes('phase')) {
        setPhase(row[0].toUpperCase());
        return data;
      }

      if (row[0].includes('week')) {
        csvWeek = row[0];

        const a = { ...data, [csvWeek]: {} };

        return a;
      }

      if (row[0].includes('day')) {
        csvDay = row[0];

        const b = {
          ...data,
          [csvWeek]: {
            ...data[csvWeek],
            [csvDay]: []
          }
        };

        return b;
      } else {
        const c = {
          ...data,
          [csvWeek]: {
            ...data[csvWeek],
            [csvDay]: [
              ...data[csvWeek][csvDay],
              {
                uuid: uuid(),
                name: row[0],
                sets: row[1],
                reps: row[2],
                total: row[3] ? row[3] : row[1] * row[2],
                percent: row[4],
                weight: row[5]
              }
            ]
          }
        };

        return c;
      }
    }, {});

    setWorkoutData(data);
  };

  const addWorkoutGroup = () => {
    const blankWorkoutGroup = {
      uuid: uuid(),
      name: '',
      sets: '',
      reps: '',
      percent: '',
      weight: ''
    };

    let newData = update(workoutData, {
      $merge: {
        ['week_' + dict[week]]: {
          ['day_' + dict[day]]: [blankWorkoutGroup]
        }
      }
    });

    if (
      workoutData['week_' + dict[week]] &&
      workoutData['week_' + dict[week]]['day_' + dict[day]]
    ) {
      newData = update(workoutData, {
        ['week_' + dict[week]]: {
          ['day_' + dict[day]]: { $push: [blankWorkoutGroup] }
        }
      });
    } else if (workoutData['week_' + dict[week]]) {
      newData = update(workoutData, {
        ['week_' + dict[week]]: {
          $merge: { ['day_' + dict[day]]: [blankWorkoutGroup] }
        }
      });
    }

    setWorkoutData(newData);
  };

  const removeWorkoutGroup = uuid => {
    const filteredDay = workoutData['week_' + dict[week]][
      'day_' + dict[day]
    ].filter(wo => wo.uuid !== uuid);

    let filteredData = update(workoutData, {
      ['week_' + dict[week]]: {
        ['day_' + dict[day]]: { $set: filteredDay }
      }
    });

    if (filteredData['week_' + dict[week]]['day_' + dict[day]].length < 1) {
      delete filteredData['week_' + dict[week]]['day_' + dict[day]];
    }

    setWorkoutData(filteredData);
  };

  const onChange = workout => {
    let index = 0;

    workoutData['week_' + dict[week]]['day_' + dict[day]].forEach((w, i) => {
      if (w.uuid && w.uuid === workout.uuid) {
        index = i;
      }
    });

    const newData = update(workoutData, {
      ['week_' + dict[week]]: {
        ['day_' + dict[day]]: {
          [index]: { $set: workout }
        }
      }
    });

    setWorkoutData(newData);
  };

  const save = () => {
    firestore
      .collection('WORKOUT_PROGRAMS')
      .doc(phase)
      .set(workoutData)
      .then(() => {
        setCompleted('Phase Uploaded');
      });
  };

  return (
    <section className='workout-creator'>
      <CSVReader
        cssClass='csv-reader-input'
        label='Upload a .csv'
        onFileLoaded={handleFile}
        onError={err => console.log(err)}
      />
      <div className='form workout-creator__form' onSubmit={save}>
        <div className='workout-datetime'>
          <div>
            <p>Day: </p>
            <Dropdown
              placeholder='Select Day'
              fluid
              selection
              onChange={(e, { value }) => setDay(value)}
              value={day}
              options={['1', '2', '3', '4', '5', ' 6', '7'].map(a => {
                return {
                  key: a,
                  text: a,
                  value: a
                };
              })}
            />
          </div>
          <div>
            <p>Week: </p>
            <Dropdown
              placeholder='Select Week'
              fluid
              selection
              onChange={(e, { value }) => setWeek(value)}
              value={week}
              options={['1', '2', '3', '4'].map(a => {
                return {
                  key: a,
                  text: a,
                  value: a
                };
              })}
            />
          </div>
          <div>
            <p>Phase: </p>
            <Dropdown
              placeholder='Select Phase'
              fluid
              selection
              onChange={(e, { value }) => setPhase(value)}
              value={phase}
              options={['1', '2', '3', '4'].map(a => {
                return {
                  key: 'PHASE_' + dict[a].toUpperCase(),
                  text: a,
                  value: 'PHASE_' + dict[a].toUpperCase()
                };
              })}
            />
          </div>
        </div>
        {workoutData['week_' + dict[week]] &&
        workoutData['week_' + dict[week]]['day_' + dict[day]]
          ? workoutData['week_' + dict[week]]['day_' + dict[day]].map(
              (d, i) => {
                return (
                  <FormGroup
                    key={d.uuid}
                    onChange={onChange}
                    data={d}
                    removeWorkoutGroup={removeWorkoutGroup}
                  />
                );
              }
            )
          : null}
        <div className='save-button'>
          <button type='submit' className='btn--white-text' onClick={save}>
            Save
          </button>
        </div>
      </div>
      <button className='btn--white-text' onClick={addWorkoutGroup}>
        Add
      </button>
      {completed ? <div className='completed-message'>{completed}</div> : null}
    </section>
  );
};

const FormGroup = ({ onChange, data, removeWorkoutGroup }) => {
  const [name, setName] = useState(data.name ? data.name : '');
  const [reps, setReps] = useState(data.reps ? data.reps : '');
  const [sets, setSets] = useState(data.sets ? data.sets : '');
  const [percent, setPercent] = useState(data.percent ? data.percent : '');
  const [weight, setWeight] = useState(data.weight ? data.weight : '');
  const [errors, setErrors] = useState({});

  const checkErrors = (key, value) => {
    if (!value) {
      setErrors({ [key]: capitalize(key) + ' Required!' });
    } else {
      setErrors({ [key]: '' });
    }

    setTimeout(() => {
      setErrors({});
    }, 3000);
  };

  useEffect(() => {
    if (name || reps || sets || percent || weight) {
      const workoutObj = {
        uuid: data.uuid,
        name: name ? name : '',
        reps: reps ? reps : '',
        sets: sets ? sets : '',
        total: reps && sets ? reps * sets : '',
        percent: percent ? percent : '',
        weight: weight ? weight : ''
      };

      console.log(workoutObj);

      onChange(workoutObj, data.uuid);
    }
    // eslint-disable-next-line
  }, [name, reps, sets, percent, weight]);

  return (
    <div className='workout-group'>
      <div className='workout-group__header'>
        <Icon name='delete' onClick={() => removeWorkoutGroup(data.uuid)} />
        {/* <Icon name='arrow down' />
        <Icon name='arrow up' /> */}
      </div>
      <div className='form__input'>
        <label className='required'>Workout Name</label>
        <input
          type='text'
          name='name'
          onChange={e => setName(e.target.value)}
          value={name}
          onBlur={e => checkErrors('name', e.target.value)}
        />
        {errors.name ? <span>{errors.name}</span> : null}
      </div>
      <div className='workout-group__values'>
        <div className='form__input'>
          <label htmlFor='reps' className='required'>
            Reps
          </label>
          <input
            type='text'
            name='reps'
            onChange={e => setReps(e.target.value)}
            value={reps}
            onBlur={e => checkErrors('reps', e.target.value)}
          />
          {errors.reps ? <span>{errors.reps}</span> : null}
        </div>
        <div className='form__input'>
          <label htmlFor='sets' className='required'>
            Sets
          </label>
          <input
            type='number'
            name='sets'
            onChange={e => setSets(e.target.value)}
            value={sets}
            onBlur={e => checkErrors('sets', e.target.value)}
          />
          {errors.sets ? <span>{errors.sets}</span> : null}
        </div>
        <div className='form__input'>
          <label htmlFor='percent'>Percent</label>
          <input
            type='text'
            name='percent'
            onChange={e => setPercent(e.target.value)}
            value={percent}
          />
        </div>
        <div className='form__input'>
          <label htmlFor='weight'>Weight</label>
          <input
            type='text'
            name='weight'
            onChange={e => setWeight(e.target.value)}
            value={weight}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkoutCreator;
