import React, { useEffect, useMemo, useState } from 'react';
import {useParams} from 'react-router-dom'
import {useSelector} from 'react-redux';
import { selectExerciseById } from '../../../state/slices/exerciseSlice/selectors';
import { RootState } from '../../../state/store';
import { isReasonoteFlashCardExercise } from '../../../models/Exercise/ReasonoteFlashCardExercise';
import { FlashCardExercise } from '../../components/Exercises/FlashCardExercise/FlashCardExercise';
import { fbdb } from '../../../services';
import { ReasonoteExercise } from '../../../models/Exercise/ReasonoteExercise';

export function ExercisePage(){
    const {exerciseId} = useParams<{exerciseId: string}>();
    const [exercise, setExercise] = useState<ReasonoteExercise|undefined>(undefined)
    // const exercise = useSelector((s: RootState) => selectExerciseById(s, exerciseId));
    useEffect(() => {
        try {
            (async () => {
                const stuff = await fbdb.collection("exercises").doc(exerciseId).get();
                const conv = ReasonoteExercise.nonstrict().parse(stuff.data())
                setExercise(conv)
            })()
        }
        catch {
            console.error("something went wrong.")
        }
    }, [exerciseId])

    return <div style={{
        display: "grid",
        width: "100%",
        height: "auto",
        justifyContent: "center",
        alignContent: "center"
    }}>
        {
            isReasonoteFlashCardExercise(exercise) ?
                <FlashCardExercise 
                    key={exercise && exercise.id}
                    flashCard={exercise} />
                :
                <div>Non-Flash card exercises coming soon</div>
        }
    </div>
}