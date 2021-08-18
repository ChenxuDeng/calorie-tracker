import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createStore,combineReducers,applyMiddleware} from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";
import calorieTracker from "./store/reducer/calorieTracker";

const reducers=combineReducers({
    calorieTracker:calorieTracker
})

const store=createStore(reducers,applyMiddleware(thunk))

export type state=ReturnType<typeof reducers>

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
          <App />
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
