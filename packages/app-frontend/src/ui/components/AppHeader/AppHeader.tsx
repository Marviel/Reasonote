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
                columnGap: "5px",
                color: "lightgray"
            }}>
                <h3 onClick={() => dispatch(push("/exercises"))}>Exercise</h3>
                <h3 onClick={() => dispatch(push("/explore"))}>Explore</h3>
            </div>
        </div>        
    </header>
}

