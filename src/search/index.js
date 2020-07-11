'use strict'

import React from 'react';
import ReactDom from 'react-dom';
// import './search.css';
import './search.less';
import logo from './images/logo.png';
import '../../commom/index';
import { a } from './tree-shaking';
import largeNumber from 'large-number-viencong';

if(false){
    a();
}
class Search extends React.Component {
    constructor(){
        super(...arguments);

        this.state = {
            Text:null
        }
    }

    loadComponent = ()=> {
        import('./text.js').then((Text) => {
            this.setState({
                Text: Text.default
            });
        })
    };
    render() {
        // a = 1;
        // debugger;
        const { Text } = this.state;
        const addResult = largeNumber('111','111');
        return <div className="search-text">
            { Text ? <Text /> : null} { addResult }
           Search Text!<img src={logo} onClick={this.loadComponent.bind(this)}/>
            </div>
    }
}

ReactDom.render(
    <Search />,
    document.getElementById('root')
)