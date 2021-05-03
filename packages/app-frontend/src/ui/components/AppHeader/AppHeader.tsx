import { Typography } from '@material-ui/core';
import React from 'react';
import {push} from 'connected-react-router'
import { AppDispatch } from '../../../state/store';
import {useDispatch} from 'react-redux';

export function AppHeader(){
    const dispatch: AppDispatch = useDispatch();

    return <header style={{
        "width": "100%",
    }}>
        <div style={{
            display: "grid",
            gridAutoFlow: "column",
            columnGap: "5px",
            gridAutoColumns: "min-content"
        }}>
            <div style={{
                display: "grid",
                gridAutoFlow: "column",
                columnGap: "5px",
                color: "white"
            }}>
                <h2>Reasonote</h2>
            </div>
            <div style={{
                display: "grid",
                gridAutoFlow: "column",
                columnGap: "10px",
                color: "lightgray",
                paddingLeft: "15px",
                justifyItems: "center",
                alignItems: "center",
            }}>
                <h5 style={{cursor: "pointer"}} onClick={() => dispatch(push("/exercises"))}>Practice</h5>
                <h5 style={{cursor: "pointer"}} onClick={() => dispatch(push("/exercises/create"))}>New Exercise</h5>
                <h5 style={{cursor: "pointer"}} onClick={() => dispatch(push("/concepts/create"))}>New Concept</h5>
            </div>
        </div>        
    </header>
}

