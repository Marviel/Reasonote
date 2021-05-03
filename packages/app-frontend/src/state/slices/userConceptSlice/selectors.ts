import { EntityId } from '@reduxjs/toolkit';
import _ from 'lodash';
import { UserConcept } from '../../../models/UserConcept';
import { isSynchedDown } from '../../../synch/PendingDownSynch';
import { notEmpty } from '../../../utils/typeUtils';
import { RootState } from '../../store';
import { selectConceptById } from '../conceptSlice';
import { userConceptsAdapter } from './state';

export const {
    selectById: selectUserConceptById,
    selectAll: selectAllUserConcepts,
} = userConceptsAdapter.getSelectors((state: RootState) => state.userConcepts)

export const selectUserConceptIdsMatching = (state: RootState, f: (userConcept: UserConcept) => boolean): string[] => {
    return Object.values(state.userConcepts.entities).filter(notEmpty).filter(f).map((uc) => uc.id)
}

export const selectUserConceptIdNaturally = (state: RootState, userId: string, conceptId: string): string | undefined  => {
    return _.first(selectUserConceptIdsMatching(state, (uc) => uc.userId === userId && uc.conceptId === conceptId))
}

export const selectUserConceptNaturally = (state: RootState, userId: string, conceptId: string): UserConcept | undefined  => {
    const userConceptId = selectUserConceptIdNaturally(state, userId, conceptId)
    return userConceptId ? selectUserConceptById(state, userConceptId) : undefined;
}

export const selectUserCombinedConcepts = (state: RootState) => {
    const userConcepts = selectAllUserConcepts(state);

    return userConcepts.map((uc) => {
        const concept = selectConceptById(state, uc.conceptId);

        return concept && isSynchedDown(concept) ? {
            ...uc,
            ...concept
        } : undefined;
    }).filter(notEmpty)
}