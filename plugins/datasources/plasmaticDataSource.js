/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function (window) {
    const TYPE_INFO = {
        type: "plasmatic-dataSource",
        name: "Plasmatic Data Source",
        version: "0.0.1",
        author: "Plasmatic",
        kind: "datasource",
        dependencies: [
            "https://code.jquery.com/jquery-3.2.1.min.js"
        ],
        description: "Datasource that provides data retrieved from plasmatic REST end-point.",
        settings: [
            {
                id: "endpoint",
                name: "Endpoint",
                description: "The endpoint to retrieve data form.",
                type: "string",
                defaultValue: "http://localhost:8080/api/random"
            }
        ]
    };


    function getNextDatapoint(endpoint) {
        return Math.floor(Math.random() * 100);
    }

    class Datasource {


        initialize(props) {
            props.setFetchInterval(1200);
            const history = props.state.data;
            // Initialize with non random values to demonstrate loading of historic values
            this.history = history || []; // [{value: 10}, {value: 20}, {value: 30}, {value: 40}, {value: 50}]
            this.x = 0;
        
            if (this.history.length > 1) {
                this.x = history[history.length - 1].x + 1 || 0;
            }
        }

        datasourceWillReceiveProps(props) {
        }

        fetchData(resolve, reject) {
            let endpoint = this.props.state.settings.endpoint;
            
            $.getJSON(endpoint, (data) => {
               console.log(data);
               this.appendValue(data);
               resolve(data);
            });            
        }

        getValues() {
            return this.history;
        }

        appendValue(value) {
            this.history.push(value);

            const maxValues = 1000;
            while (this.history.length > maxValues) {
                this.history.shift();
            }
        }
        

        dispose() {
            this.history = [];
            console.log("Plasmatic Datasource destroyed");
        }
    }


    window.iotDashboardApi.registerDatasourcePlugin(TYPE_INFO, Datasource);

})(window);
