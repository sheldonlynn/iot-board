import PluginRegistry from "../pluginApi/pluginRegistry";
import {IPluginModule, IDatasourcePlugin} from "../pluginApi/pluginTypes";
import DataSourcePluginFactory from "./datasourcePluginFactory";
import {DashboardStore} from "../store";
import * as Plugins from "../pluginApi/pluginLoader";

/**
 * Describes how we expect the plugin module to be
 */
export interface IDatasourcePluginModule extends IPluginModule {
    Datasource: IDatasourcePlugin
}

export default class DatasourcePluginRegistry extends PluginRegistry<IDatasourcePluginModule, DataSourcePluginFactory> {

    private _fetchIntervalRef: number;
    private _disposed: boolean = false;

    constructor(_store: DashboardStore) {
        super(_store);
    }

    get disposed() {
        return this._disposed
    }

    createPluginFromModule(module: IDatasourcePluginModule) {
        console.assert(_.isObject(module.TYPE_INFO), "Missing TYPE_INFO on datasource module. Every module must export TYPE_INFO");
        return new DataSourcePluginFactory(module.TYPE_INFO.type, module.Datasource, this.store);
    }

    dispose() {
        if (!this._disposed) {
            this._disposed = true;
            clearInterval(this._fetchIntervalRef);
            this._fetchIntervalRef = null;
            super.dispose();
        }
    }
}
