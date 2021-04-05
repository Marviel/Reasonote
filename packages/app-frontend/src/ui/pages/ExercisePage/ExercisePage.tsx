import React from 'react';
import {useParams} from 'react-router-dom'
import {useSelector} from 'react-redux';
import { selectExerciseById } from '../../../state/slices/exerciseSlice/selectors';
import { RootState } from '../../../state/store';
import { isReasonoteFlashCardExercise } from '../../../models/Exercise/ReasonoteFlashCardExercise';
import { FlashCardExercise } from '../../components/Exercises/FlashCardExercise/FlashCardExercise';

export function ExercisePage(){
    const {exerciseId} = useParams<{exerciseId: string}>();
    const exercise = useSelector((s: RootState) => selectExerciseById(s, exerciseId));

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