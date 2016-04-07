import * as React from 'react';
import {Component} from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import {connect} from 'react-redux'
import {Provider} from 'react-redux'
import {CounterApp} from './exampleCounter'
import * as WidgetGrid from './widgetGrid'

export default class Layout extends Component {
    render() {
        return <div className="container">
            <div className="ui fixed inverted menu">
                <div className="ui container">
                    <a href="#" className="header item">
                        <img className="logo" src="assets/images/logo.png"/>
                        Project Name
                    </a>
                    <a href="#" className="item">Home</a>
                    <div className="ui simple dropdown item">
                        Dropdown <i className="dropdown icon"></i>
                        <div className="menu">
                            <a className="item" href="#">Link Item</a>
                            <a className="item" href="#">Link Item</a>
                            <div className="divider"></div>
                            <div className="header">Header Item</div>
                            <div className="item">
                                <i className="dropdown icon"></i>
                                Sub Menu
                                <div className="menu">
                                    <a className="item" href="#">Link Item</a>
                                    <a className="item" href="#">Link Item</a>
                                </div>
                            </div>
                            <a className="item" href="#">Link Item</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="ui grid">
             
                    <WidgetGrid.WidgetGrid widgets={[1,2,3,4]}/>
               
            </div>
            <CounterApp/>
        </div>
    }

}