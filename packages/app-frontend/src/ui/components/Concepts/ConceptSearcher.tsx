import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useState, useEffect } from "react";
import { Concept } from "../../../models/Concept";
import { fbdb } from "../../../services";
import { dataFromQuery, normalizeFirestoreData } from "../../../utils/firebaseUtils";


interface IConceptSearcherProps {
    selectionChangedCallback: (concepts: Concept[]) => any,
}

export function ConceptSearcher(props: IConceptSearcherProps){
    const [open, setOpen] = useState(true);
    const [options, setOptions] = useState<Concept[]>([]);
    const [selected, setSelected] = useState<Concept[]>([]);
    const loading = open && options.length === 0;

    useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            // TODO this should only be concepts which the user has
            // access to.
            const data = await dataFromQuery(fbdb.collection("concepts"))
            const concepts = data.map((d) => {
                return Concept.parse(normalizeFirestoreData(d))
            })
            setOptions(concepts)
            
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    // React.useEffect(() => {
    //     if (!open) {
    //     setOptions([]);
    //     }
    // }, [open]);

    return <Autocomplete
        multiple
        id="tags-standard"
        options={options}
        onChange={(a, v) => {props.selectionChangedCallback(v)}}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
            <TextField
                {...params}
                variant="standard"
                label="Choose Concepts"
                placeholder="Concepts"
            />
        )}
    />
}