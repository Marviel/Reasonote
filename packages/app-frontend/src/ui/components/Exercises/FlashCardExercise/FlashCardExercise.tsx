import React from 'react';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { ReasonoteFlashCardExercise } from '../../../../models/Exercise/ReasonoteFlashCardExercise';
import {Button, Chip, Typography} from "@material-ui/core"
import { AppDispatch } from '../../../../state/store';
import { beginNextExercise, submitExerciseGrade } from '../../../../state/slices/multiSliceActions';
import { ConceptTreeNestedList } from '../ConceptTree/ConceptTreeNestedList';

export interface IFlashCardExerciseProps {
    flashCard: ReasonoteFlashCardExercise
}

export function FlashCardExercise(props: IFlashCardExerciseProps){
    const dispatch = useDispatch<AppDispatch>();
    const {
        flashCard
    } = props;

    const [isComplete, setIsComplete] = useState(false);
    const onGrade = async (grade: number) => {
        await dispatch(submitExerciseGrade(flashCard.id, "DUMMY_USER", grade))
        await dispatch(beginNextExercise("DUMMY_USER"))
    }

    return <div>
        {/* 
            The Card Body
        */}
        <div style={{
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
            <h1>
                {flashCard.prompt}
            </h1>
            {
                isComplete ?
                <div style={{
                    display: "grid",
                    gridAutoFlow: "row",
                    justifyContent: "center",
                    alignContent: "center"
                }}>
                    <h2>
                        {flashCard.response}
                    </h2>
                    <div style={{
                        display: "grid",
                        gridAutoFlow: "column",
                        columnGap: "10px",
                        gridAutoColumns: "min-content"
                    }}>
                        <Chip label="Very Hard" style={{backgroundColor: "darkred"}} onClick={() => onGrade(0)}/>
                        <Chip label="Hard" style={{backgroundColor: "red"}} onClick={() => onGrade(1.5)}/>
                        <Chip label="Medium" style={{backgroundColor: "sienna"}} onClick={() => onGrade(3.5)}/>
                        <Chip label="Easy" style={{backgroundColor: "green"}} onClick={() => onGrade(4)}/>
                        <Chip label="Very Easy" style={{backgroundColor: "lightgreen"}} onClick={() => onGrade(5)}/>
                    </div>
                </div>
                :
                <Button
                    onClick={() => setIsComplete(true)} 
                    style={{
                        cursor: "pointer",
                        background: "slateblue",
                        color: "#D3D3D3"
                }}>Show Response</Button>
            }
        </div>

        {/* 
            The Concept Listing
         */}
        <div style={{
            padding: "20px"
        }}>
            <Typography variant={"h5"}>Concept Tree</Typography>
            {flashCard.skills.map((s) => <ConceptTreeNestedList conceptId={s.subject}/>)}
        </div>
    </div>
}