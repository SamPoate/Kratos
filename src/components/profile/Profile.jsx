import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirebase, useFirestoreConnect } from 'react-redux-firebase';

import Loading from '../layout/Loading';
import moment from 'moment';
import { Menu, Dropdown } from 'semantic-ui-react';
import { capitalize } from '../../helpers/formatters';

const Profile = props => {
    const [squat, setSquat] = useState('0');
    const [bench, setBench] = useState('0');
    const [deadLift, setDeadLift] = useState('0');
    const [user, setUser] = useState(false);
    const [closestDate, setClosestDate] = useState(Infinity);
    const [activeItem, setActiveItem] = useState('Home');
    const [phaseSaving, setPhaseSaving] = useState(false);
    let phaseOptions = [];
    useFirestoreConnect('WORKOUT_PROGRAMS');
    useFirestoreConnect('settings');

    useEffect(() => {
        let localDate = Infinity;
        if (props.profile.weights) {
            const dates = Object.keys(props.profile.weights);

            dates.forEach(date => {
                const diff = moment().diff(date);

                if (diff < closestDate) {
                    localDate = date;
                    setClosestDate(date);
                }
            });
        }

        if (localDate !== Infinity) {
            setSquat(props.profile.weights[localDate].squat);
            setBench(props.profile.weights[localDate].bench);
            setDeadLift(props.profile.weights[localDate].deadLift);
        }
    }, [props.profile.weights, closestDate]);

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
        // eslint-disable-next-line
    }, []);

    const numberWithCommas = x => {
        var parts = x.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    };

    const sortType = name => {
        let workoutType;
        if (name.toLowerCase().includes('squat')) {
            workoutType = 'squat';
        } else if (name.toLowerCase().includes('bench')) {
            workoutType = 'bench';
        } else if (name.toLowerCase().includes('deadlift')) {
            workoutType = 'deadLift';
        } else {
            return null;
        }
        return workoutType;
    };

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
        const weight =
            closestDate !== Infinity
                ? (parseInt(props.profile.weights[closestDate][workoutType]) /
                      100) *
                  percent
                : 0;
        data.weight = weight;
        data.type = workoutType;

        const formattedWeight = parseFloat(weight.toFixed(2));
        return formattedWeight;
    };

    let totalVolume = {};
    const calcTotals = () => {
        const data = props.data && props.phase ? props.data[props.phase] : null;
        if (!data) {
            return;
        }

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                for (const k in data[key]) {
                    if (data[key].hasOwnProperty(k)) {
                        const el = data[key][k];

                        el.forEach(x => {
                            if (!sortType(x.name)) return;

                            totalVolume[sortType(x.name)] = totalVolume[
                                sortType(x.name)
                            ]
                                ? totalVolume[sortType(x.name)] +
                                  x.total * parseInt(calcWeight(x))
                                : 0 + x.total * parseInt(calcWeight(x));
                        });
                    }
                }
            }
        }
    };

    calcTotals();

    const onChangePhase = value => {
        setPhaseSaving(true);

        const data = {
            set_phase: value
        };

        props.firebase.updateProfile(data).then(() => setPhaseSaving(false));
    };

    const onSubmit = async () => {
        const data = {
            weights: {
                [moment().format()]: {
                    squat: squat,
                    bench: bench,
                    deadLift: deadLift
                }
            }
        };

        await props.firebase.updateProfile(data);
    };

    if (user === false) {
        return <h1 className='admin-approval'>Awaiting Approval</h1>;
    }

    if (!props.phase) {
        const data = {
            set_phase: 'PHASE_ONE'
        };

        props.firebase.updateProfile(data);
    }

    if (!props.settings) return null;

    if (props.settings.phases.phase_one.active) {
        phaseOptions = [
            ...phaseOptions,
            {
                key: 'phaseOne',
                text: 'Phase One',
                value: 'PHASE_ONE'
            }
        ];
    }

    if (props.settings.phases.phase_two.active) {
        phaseOptions = [
            ...phaseOptions,
            {
                key: 'phaseTwo',
                text: 'Phase Two',
                value: 'PHASE_TWO'
            }
        ];
    }

    if (props.settings.phases.phase_three.active) {
        phaseOptions = [
            ...phaseOptions,
            {
                key: 'phaseThree',
                text: 'Phase Three',
                value: 'PHASE_THREE'
            }
        ];
    }

    if (props.settings.phases.phase_four.active) {
        phaseOptions = [
            ...phaseOptions,
            {
                key: 'phaseFour',
                text: 'Phase Four',
                value: 'PHASE_FOUR'
            }
        ];
    }

    return (
        <main id='profile'>
            <Menu tabular>
                <Menu.Item
                    name='Home'
                    active={activeItem === 'Home'}
                    onClick={(e, { name }) => setActiveItem(name)}
                />
                <Menu.Item
                    name='Settings'
                    active={activeItem === 'Settings'}
                    onClick={(e, { name }) => setActiveItem(name)}
                />
            </Menu>
            <h1>
                {props.profile.isLoaded ? `${props.displayName}'s ` : null}
                Profile
            </h1>
            {props.profile.isLoaded && user && props.phase ? (
                <div className='profile__container'>
                    {activeItem === 'Home' ? (
                        <div className='info'>
                            <h3>
                                Total Volume Phase{' '}
                                {capitalize(
                                    props.phase
                                        .replace('PHASE_', '')
                                        .toLowerCase()
                                )}
                            </h3>
                            <div className='info__box'>
                                <label>Squat</label>
                                <div>
                                    {totalVolume.squat
                                        ? numberWithCommas(totalVolume.squat)
                                        : 0}
                                    kg
                                </div>
                            </div>
                            <div className='info__box'>
                                <label>Bench Press</label>
                                <div>
                                    {totalVolume.bench
                                        ? numberWithCommas(totalVolume.bench)
                                        : 0}
                                    kg
                                </div>
                            </div>
                            <div className='info__box'>
                                <label>Deadlift</label>
                                <div>
                                    {totalVolume.deadLift
                                        ? numberWithCommas(totalVolume.deadLift)
                                        : 0}
                                    kg
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='form'>
                            <div className='form-input'>
                                <label>Squat</label>
                                <input
                                    type='number'
                                    value={squat}
                                    onChange={e => setSquat(e.target.value)}
                                />
                            </div>
                            <div className='form-input'>
                                <label>Bench Press</label>
                                <input
                                    type='number'
                                    value={bench}
                                    onChange={e => setBench(e.target.value)}
                                />
                            </div>
                            <div className='form-input'>
                                <label>Deadlift</label>
                                <input
                                    type='number'
                                    value={deadLift}
                                    onChange={e => setDeadLift(e.target.value)}
                                />
                            </div>
                            <button
                                className='submit btn--white-text'
                                onClick={onSubmit}
                            >
                                Submit
                            </button>
                            <h3>Phase</h3>
                            <Dropdown
                                placeholder='Select Phase'
                                fluid
                                selection
                                value={props.profile.set_phase}
                                onChange={(e, { value }) =>
                                    onChangePhase(value)
                                }
                                options={phaseOptions}
                                loading={phaseSaving}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <Loading />
            )}
        </main>
    );
};

const mapStateToProps = state => ({
    data: state.firestore.data.WORKOUT_PROGRAMS,
    settings: state.firestore.data.settings,
    phase: state.firebase.profile.set_phase,
    profile: state.firebase.profile,
    displayName: state.firebase.auth.displayName
});

export default compose(withFirebase, connect(mapStateToProps, null))(Profile);
