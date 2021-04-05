import React from 'react';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { ReasonoteFlashCardExercise } from '../../../../models/Exercise/ReasonoteFlashCardExercise';
import {Button, Chip, TextField} from "@material-ui/core"
import { AppDispatch } from '../../../../state/store';
import { beginNextExercise, createFlashCardExercise, submitExerciseGrade } from '../../../../state/slices/multiSliceActions';

export function FlashCardExerciseCreator(){
    const dispatch = useDispatch<AppDispatch>();

    const [prompt, setPrompt] = useState<string>("");
    const [answer, setAnswer] = useState<string>("");

    const onCreate = async () => {
        await dispatch(createFlashCardExercise(prompt, answer))
    }

    return <div style={{
        display: "grid",
        gridAutoFlow: "row",
        rowGap: "10px",
        borderWidth: "1px",
        borderColor: "white",
        borderStyle: "solid",
        borderRadius: "10px",
        padding: "10px",
    }}>
        <h1>
            Prompt
        </h1>
        <TextField onChange={(ev) => setPrompt(ev.target.value)}/>

        <h1>
            Answer
        </h1>
        <TextField onChange={(ev) => setAnswer(ev.target.value)}/>

        <Button onClick={() => onCreate()}>Create</Button>
    </div>
}