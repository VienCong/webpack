'use strict'

const React = require('react');
const largeNumber = require('large-number-viencong');
const logo = require('./images/logo.png');
require('./search.less');
class Search extends React.Component {
    constructor(){
        super(...arguments);

        this.state = {
            Text:null
        }
    }

    loadComponent() {
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
           Search Text!@@@<img src={logo} onClick={this.loadComponent.bind(this)}/>
            </div>
    }
}

module.exports = <Search />;