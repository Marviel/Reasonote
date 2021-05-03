import React from 'react';
import {useParams} from 'react-router-dom'
import {useSelector} from 'react-redux';
import { selectExerciseById } from '../../../state/slices/exerciseSlice/selectors';
import { RootState } from '../../../state/store';
import { isReasonoteFlashCardExercise } from '../../../models/Exercise/ReasonoteFlashCardExercise';
import { FlashCardExercise } from '../../components/Exercises/FlashCardExercise/FlashCardExercise';
import { ConceptCreator } from '../../components/Concepts/ConceptCreator';

export function ConceptCreatePage(){
    return <div style={{
        display: "grid",
        width: "100%",
        height: "auto",
        justifyContent: "center",
        alignContent: "center"
    }}>
        <ConceptCreator/>
    </div>
}