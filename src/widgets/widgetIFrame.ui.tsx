/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import {connect} from 'react-redux'
import * as WidgetConfig from './widgetConfig'
import * as WidgetPlugins from './widgetPlugins'
import {deleteWidget, IWidgetState} from './widgets'
import * as Widgets from './widgets'
import {PropTypes as Prop}  from "react";
import Dashboard from '../dashboard'
import {IWidgetPluginState} from "./widgetPlugins";

interface WidgetIFrameProps {
    widget: IWidgetState
    widgetPlugin: IWidgetPluginState
}

/**
 * The Dragable Frame of a Widget.
 * Contains generic UI controls, shared by all Widgets
 */
class WidgetIFrame extends React.Component<WidgetIFrameProps, void> {

    constructor(props: WidgetIFrameProps) {
        super(props)
    }

    render() {
        return <iframe id={this.props.widget.id} src={"widget.html#" + this.props.widgetPlugin.url} frameBorder="0" width="100%" height="100%" scrolling="no"
                       sandbox="allow-forms allow-popups allow-scripts allow-same-origin allow-modals">
            Browser does not support iFrames.
        </iframe>
    };
}
export default WidgetIFrame;
