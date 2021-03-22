import React from 'react';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import { ReasonoteFlashCardExercise } from '../../../../models/Exercise';
import {Chip} from "@material-ui/core"

export interface IFlashCardExerciseProps {
    flashCard: ReasonoteFlashCardExercise
}

export function FlashCardExercise(props: IFlashCardExerciseProps){
    const {
        flashCard
    } = props;

    const [isComplete, setIsComplete] = useState(false);

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
                    <Chip label="Easy" style={{backgroundColor: "green"}}/>
                    <Chip label="Medium" style={{backgroundColor: "sienna"}}/>
                    <Chip label="Hard" style={{backgroundColor: "red"}}/>
                </div>
            </div>
            :
            <div
                onClick={() => setIsComplete(true)} 
                style={{
                    cursor: "pointer",
            }}>Show Response</div>
        }
    </div>
}