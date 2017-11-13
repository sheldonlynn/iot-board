/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import "semantic-ui-css/semantic.css";
import "semantic-ui-css/semantic";
import "expose?$!expose?jQuery!jquery";
import "expose?React!react";
import "expose?_!lodash";
import "./pluginApi/freeboardPluginApi";
import "./pluginApi/pluginApi";
import "./app.css";
import "file?name=[name].[ext]!./index.html";
import "react-grid-layout/css/styles.css";
import "isomorphic-fetch";
import * as es6promise from "es6-promise";
import * as Renderer from "./renderer.js";
import * as Store from "./store";
import * as Persist from "./persistence";
import Dashboard from "./dashboard";
import * as $ from 'jquery';
import * as AppState from './appState';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {Provider} from "react-redux";
import Layout from "./pageLayout";
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const loadPredefinedState = $.get('./dashboard.json');
es6promise.polyfill();

loadPredefinedState.then((data: any) => {
    console.log("Starting dashboard with predefined state");
    runWithState(data);
}).fail((error) => {
    if (error.status === 404) {
        // When the file is not available just start the dashboard in devMode
        console.warn("There is no ./dashboard.json - The Dashboard will be loaded in Developer Mode and everything can be edited.\n" +
            "To run the board with a predefined configuration go to 'Board > Import / Export'\n" +
            "and save the exported content in a file named 'dashboard.json' next to the index.html (i.e. './dist/dashboard.json')")
        runWithState();
    }
    else if (confirm("Failed to load Dashboard from dashboard.json\n" +
            "\n" +
            "Try to load in developer mode instated?")) {
        runWithState();
    }
});


function runWithState(configuredState?: AppState.State) {
    let initialState = configuredState;
    let storeOptions = Store.defaultStoreOptions();
    if (!initialState) {
        initialState = Persist.loadFromLocalStorage() as AppState.State;
    } else {
        let devMode = false;
        if (configuredState.config) {
            devMode = configuredState.config.devMode;
        }

        if (devMode) {
            console.log("Dashboard running in devMode. Set config.devMode = false to deliver dashboard as 'view only'");
        }

        storeOptions.persist = devMode;
        initialState.global = {
            isReadOnly: !devMode
        };
    }

    const dashboardStore = Store.create(initialState, storeOptions);


    const appElement = document.getElementById('app');

    if (!appElement) {
        throw new Error("Can not get element '#app' from DOM. Okay for headless execution.");
    }

    function handleError(dashboard: Dashboard, error: Error) {
        console.warn("Fatal error. Asking user to wipe data and retry. The error will be printed below...");
        if (confirm("Fatal error. Reset all Data?\n\nPress cancel and check the browser console for more details.")) {
            dashboardStore.dispatch(Store.clearState());
            dashboard.dispose();
            start();
        }
        else {
            dashboard.dispose();
            window.onerror = () => false;
            throw error;
        }
    }

    function start() {
        let dashboard = new Dashboard(dashboardStore);

        window.onerror = function errorHandler(message: string, filename?: string, lineno?: number, colno?: number, error?: Error) {
            handleError(dashboard, error);
            return false;
        };

        dashboard.init();

        try {
            render(appElement, dashboardStore);
        }
        catch (error) {
            handleError(dashboard, error)
        }
    }

    start();

    function renderDashboard(element: Element, store: Store.DashboardStore) {
        Renderer.render(element, store);
    }

    function render(element: Element, store: Store.DashboardStore) {
        ReactDOM.render(
            <Provider store={store}>
                <BrowserRouter>
                    <div>
                        <Switch>
                            <Route exact path="/login" render={() => {
                                return <div>hi</div>
                            }} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </Provider>,
            element);
        console.log("Render!");
    }
}
