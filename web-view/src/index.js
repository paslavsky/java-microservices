import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '@mdi/font/css/materialdesignicons.min.css';
import App from './components/app';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux';
import {applyMiddleware, compose, createStore} from "redux";
import reduxThunk from 'redux-thunk';
import reducers from './reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(reduxThunk))
);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
