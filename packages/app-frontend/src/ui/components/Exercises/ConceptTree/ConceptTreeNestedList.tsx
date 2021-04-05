import React from 'react';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Chip, IconButton, TextField} from "@material-ui/core"
import { AppDispatch, RootState } from '../../../../state/store';
import { selectConceptById } from '../../../../state/slices/conceptSlice';
import { ArrowDownward, ArrowDropDown, ArrowRight, FiberManualRecord, PlayCircleFilled } from '@material-ui/icons';
import { selectUserConceptNaturally } from '../../../../state/slices/userConceptSlice';

export interface IConceptTreeNestedListProps {
    conceptId: string;
}

export function ConceptTreeNestedList(props: IConceptTreeNestedListProps){
    const dispatch = useDispatch();
    const concept = useSelector((s: RootState) => selectConceptById(s, props.conceptId))
    const [expanded, setExpanded] = useState<boolean>(true);
    const toggleExpanded = () => setExpanded(!expanded);
    const hasChildren = concept?.preRequisites !== undefined && concept.preRequisites.length > 0
    const userConcept = useSelector((s: RootState) => concept && selectUserConceptNaturally(s, "DUMMY_USER", concept.id))

    return concept ? 
    <div style={{
        display: "grid",
        justifyContent: "start",
        justifyItems: "start"
    }}>
        <div>
            <IconButton size={"small"} onClick={toggleExpanded} disabled={!hasChildren}>
            {
                hasChildren ? (
                        expanded ?
                        <ArrowDropDown fontSize={"small"} htmlColor={"white"}/>
                        :
                        <ArrowRight fontSize={"small"} htmlColor={"white"}/>
                ) :
                <ArrowRight fontSize={"small"}/>
            }
            </IconButton>
            {concept.name}
            <i>  (Mastery Level: {userConcept && userConcept.comprehensionScore ? userConcept.comprehensionScore.toFixed(1)  : ""})</i>
        </div>

        { expanded && 
            <div style={{
                            display: "grid",
                            gridAutoFlow: "column",
                            gridTemplateColumns: "max-content",
                            justifyItems: "start",
                            columnGap: "5px",
                        }}>
                <div style={{background: "white", width: "5px", marginLeft: "10px", cursor: "pointer"}} onClick={toggleExpanded}></div>
                <div style={{display: "grid", gridAutoFlow: "row"}}>
                    {
                        concept?.preRequisites.map((c) => <ConceptTreeNestedList key={c} conceptId={c}/>)
                    }
                </div>
            </div>
        }
    </div>
    : null;
}