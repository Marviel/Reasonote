import { EntityId } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { conceptsAdapter } from './state';

export const {
    selectById: selectConceptById,
    selectAll: selectAllConcepts,
} = conceptsAdapter.getSelectors((state: RootState) => state.concepts)