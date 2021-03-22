import { EntityId } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { exercisesAdapter } from './state';

export const {
    selectById: selectExerciseById,
    selectAll: selectAllExercises,
} = exercisesAdapter.getSelectors((state: RootState) => state.exercises)