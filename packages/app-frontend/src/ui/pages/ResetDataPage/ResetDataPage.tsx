import React from 'react';
import {useParams} from 'react-router-dom'
import {useSelector} from 'react-redux';
import { selectExerciseById } from '../../../state/slices/exerciseSlice/selectors';
import { RootState } from '../../../state/store';
import { isReasonoteFlashCardExercise } from '../../../models/Exercise/ReasonoteFlashCardExercise';
import { FlashCardExercise } from '../../components/Exercises/FlashCardExercise/FlashCardExercise';
import { Button } from '@material-ui/core';
import { conceptsInitialState } from '../../../state/slices/conceptSlice/state';
import _ from 'lodash';
import { fbdb } from '../../../services';
import { exercisesInitialState } from '../../../state/slices/exerciseSlice/state';

async function resetAllData(){
    // Repopulate our concepts.
    _.forIn(conceptsInitialState.entities, (v, k) => {
        v && fbdb.collection("/concepts").doc(k).set(v)
    })

    // Repopulate our exercises.
    _.forIn(exercisesInitialState.entities, (v, k) => {
        v && fbdb.collection("/exercises").doc(k).set(v)
    })

    // Delete all user concepts.
    const userConcepts = await fbdb.collection("userConcepts").get()
    Promise.all(userConcepts.docs.map(async (doc) => {
        await fbdb.collection("userConcepts").doc("id").delete()
    }))
}

export function ResetDataPage(){
    const {exerciseId} = useParams<{exerciseId: string}>();
    const exercise = useSelector((s: RootState) => selectExerciseById(s, exerciseId));

    return <div style={{
        display: "grid",
        width: "100%",
        height: "auto",
        justifyContent: "center",
        alignContent: "center"
    }}>
        <Button onClick={() => resetAllData()}>RESET ALL DATA?</Button>
    </div>
}