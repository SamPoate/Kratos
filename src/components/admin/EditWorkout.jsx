import React from 'react';
import uuid from 'uuid';

import { useFirestore } from 'react-redux-firebase';
import { capitalize } from '../../helpers/formatters';

const WorkoutInfoRow = ({ id, workoutInfo, updateWorkoutInfo }) => (
    <div className='workout-editor__row'>
        <div className='form'>
            <h3>{capitalize(workoutInfo.key.replace('_', ' '))}</h3>
            <div className='form-input'>
                <label>Workout key:</label>
                <input
                    type='text'
                    value={workoutInfo.key || ''}
                    onChange={e =>
                        updateWorkoutInfo(
                            id,
                            'key',
                            e.target.value.toLowerCase().replace(' ', '_')
                        )
                    }
                />
            </div>
            <div className='form-input'>
                <label>Workout Info:</label>
                <input
                    type='text'
                    value={workoutInfo.info || ''}
                    onChange={e =>
                        updateWorkoutInfo(id, 'info', e.target.value)
                    }
                />
            </div>
        </div>
    </div>
);

const EditWorkout = ({ workoutInformation, setWorkoutInformation }) => {
    const firestore = useFirestore();

    const getWorkoutInformation = () => {
        firestore
            .collection('WORKOUT_INFORMATION')
            .get()
            .then(querySnapshot => {
                let workoutInfos = {};

                querySnapshot.forEach(doc => {
                    workoutInfos = {
                        ...workoutInfos,
                        [doc.id]: doc.data()
                    };
                });

                setWorkoutInformation(workoutInfos);
            })
            .catch(error => {
                console.log('Error getting documents: ', error);
            });
    };

    const addWorkoutRow = () => {
        setWorkoutInformation({
            ...workoutInformation,
            [uuid()]: {
                key: '',
                info: ''
            }
        });
    };

    const updateWorkoutInfo = (id, key, value) => {
        setWorkoutInformation({
            ...workoutInformation,
            [id]: {
                ...workoutInformation[id],
                [key]: value
            }
        });
    };

    const submit = () => {
        const setBatch = firestore.batch();

        Object.keys(workoutInformation).forEach(workoutKey => {
            setBatch.set(
                firestore
                    .collection('WORKOUT_INFORMATION')
                    .doc(workoutInformation[workoutKey].key),
                {
                    key: workoutInformation[workoutKey].key,
                    info: workoutInformation[workoutKey].info
                },
                { merge: true }
            );
        });

        setBatch.commit().then(() => {
            getWorkoutInformation();
        });
    };

    return (
        <section className='workout-editor'>
            <div className='workout-editor__row-container'>
                {Object.keys(workoutInformation).map(workoutInfoKey => (
                    <WorkoutInfoRow
                        key={workoutInfoKey}
                        id={workoutInfoKey}
                        workoutInfo={workoutInformation[workoutInfoKey]}
                        updateWorkoutInfo={updateWorkoutInfo}
                    />
                ))}
                <div className='workout-editor__buttons'>
                    <button className='btn--white-text' onClick={submit}>
                        Submit
                    </button>
                    <button
                        className='btn--white-text'
                        onClick={getWorkoutInformation}
                    >
                        Get
                    </button>
                    <button className='btn--white-text' onClick={addWorkoutRow}>
                        Add
                    </button>
                </div>
            </div>
        </section>
    );
};

export default EditWorkout;
