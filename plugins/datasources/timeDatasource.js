/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function (window) {
    const TYPE_INFO = {
        type: "time",
        name: "Time",
        version: "0.0.1",
        author: "Lobaro",
        kind: "datasource"
    };


    class Datasource {

        renderTime() {
            const currentTime = new Date();
            let diem = 'AM';
            let h = currentTime.getHours();
            let m = currentTime.getMinutes();
            let s = currentTime.getSeconds();

            if (h === 0) {
                h = 12;
            } else if (h > 12) {
                h = h - 12;
                diem = 'PM';
            }

            if (m < 10) {
                m = '0' + m;
            }
            if (s < 10) {
                s = '0' + s;
            }
            return {
                hours: h,
                minutes: m,
                seconds: s,
                diem
            };
        }

        fetchData(resolve, reject) {
            const now = new Date();
            resolve([{date: now}])
        }

    }

    window.iotDashboardApi.registerDatasourcePlugin(TYPE_INFO, Datasource);

})(window);
