import React from 'react';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { ReasonoteFlashCardExercise } from '../../../../models/Exercise/ReasonoteFlashCardExercise';
import {Button, Chip, TextField} from "@material-ui/core"
import { AppDispatch } from '../../../../state/store';
import { beginNextExercise, createFlashCardExercise} from '../../../../state/slices/multiSliceActions';
import { ConceptSearcher } from '../../Concepts/ConceptSearcher';
import { Concept } from '../../../../models/Concept';

export function FlashCardExerciseCreator(){
    const dispatch = useDispatch<AppDispatch>();

    const [prompt, setPrompt] = useState<string>("");
    const [answer, setAnswer] = useState<string>("");
    const [concepts, setConcepts] = useState<Concept[]>([]);

    const onCreate = async () => {
        await dispatch(createFlashCardExercise(
            prompt, 
            answer, 
            concepts.map((c) => ({subject: c.id, strength: 1})),
        ))

        setPrompt("")
        setAnswer("")
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
        width: "33vw",
    }}>
        <h2>
            Prompt
        </h2>
        <TextField value={prompt} onChange={(ev) => setPrompt(ev.target.value)}/>
        <h2>
            Answer
        </h2>
        <TextField value={answer} onChange={(ev) => setAnswer(ev.target.value)}/>

        <h2>
            Concepts
        </h2>
        <ConceptSearcher selectionChangedCallback={(cs) => setConcepts(cs)}/>

        <Button onClick={() => onCreate()}>Create</Button>
    </div>
}