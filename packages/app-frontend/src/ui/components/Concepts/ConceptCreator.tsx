import React from 'react';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Chip, TextField} from "@material-ui/core"
import { AppDispatch } from '../../../state/store';
import { fbdb } from '../../../services';
import { ConceptSearcher } from './ConceptSearcher';
import { Concept } from '../../../models/Concept';


export function ConceptCreator(){
    const dispatch = useDispatch<AppDispatch>();

    const [conceptId, setConceptId] = useState<string>("");
    const [humanName, setHumanName] = useState<string>("");
    const [preRequisites, setPreRequisites] = useState<Concept[]>([])

    const onCreate = async () => {
        await fbdb.collection("concepts").doc(conceptId).set(Concept.parse({
            id: conceptId,
            name: humanName,
            preRequisites: preRequisites.map((c) => c.id),
        }))
        
        setConceptId("")
        setHumanName("")
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
            Concept Id
        </h2>
        <TextField value={conceptId} onChange={(ev) => setConceptId(ev.target.value)}/>
        
        <h2>
            Concept Name
        </h2>
        <TextField value={humanName} onChange={(ev) => setHumanName(ev.target.value)}/>

        <h2>Prerequisites</h2>
        <ConceptSearcher selectionChangedCallback={(options) => setPreRequisites(options)}/>
        <Button onClick={() => onCreate()}>Create</Button>
    </div>
}