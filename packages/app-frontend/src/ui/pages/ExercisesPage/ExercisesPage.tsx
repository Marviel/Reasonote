import { CircularProgress } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { beginNextExercise } from '../../../state/slices/multiSliceActions';

export function Exercises(){
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(beginNextExercise("DUMMY_USER"))
    }, [])

    return <div>
        <CircularProgress/>
        </div> 
}
