import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './ui/pages/App/App';
import reportWebVitals from './reportWebVitals';
import store, { history } from './state/store';
import {Provider} from 'react-redux';
import {ThemeProvider} from '@material-ui/core'
import { materialUItheme } from './style/materialUITheme';
import { ConnectedRouter } from 'connected-react-router'
import _ from 'lodash';
import { uuid } from './utils/uuidUtils';
import { notEmpty } from './utils/typeUtils';
import { userConceptAdded } from './state/slices/userConceptSlice';
import { UserConcept } from './models/UserConcept';
import { fbdb } from './services';
import { synchronizers } from './synch';
import firebase from 'firebase';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={materialUItheme}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// TODO DEV remove
firebase.functions().useEmulator("localhost", 5001);

// Setup every synchronizer with access to the store.
synchronizers.forEach((f) => {
  f(() => store)
})