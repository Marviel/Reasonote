import React from 'react';
import { AppHeader } from '../../components/AppHeader/AppHeader';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { Exercises } from '../ExercisesPage/ExercisesPage';
import { ExercisePage } from '../ExercisePage/ExercisePage';
import { FlashCardExerciseCreator } from '../../components/Exercises/FlashCardExercise/FlashCardExerciseCreator';

function App() {
  return (
    <div className="App">
        <AppHeader/>
        <Switch>
            <Route exact path="/">
              <Redirect to="/start"/>
            </Route>
            <Route exact path="/exercises/create">
              <FlashCardExerciseCreator />
            </Route>
            <Route exact path="/exercises">
              <Exercises />
            </Route>
            <Route exact path="/exercises/:exerciseId">
              <ExercisePage />
            </Route>
        </Switch>
    </div>
  );
}

export default App;
