(function () {
    'use strict';

    let React = require('react/addons');
    let injectTapEventPlugin = require('react-tap-event-plugin');
    let Main = require('./components/main.jsx'); // Our custom react component
    let jQuery = require("jquery");
    let {renderDevTools, createStore} = require("./helpers/devTools");
    let redux = require("redux");
    let initialCreateStore = redux.createStore;
    let _ = require("underscore");

    let { combineReducers } = require('redux');
    let { Provider } = require('react-redux');

    window.React = React;
    injectTapEventPlugin();

    let reducers = require("./helpers/util").requireAll(require.context('./reducers/', true, /\.reducer\.(js|ls|jsx)$/));
    const reducer = combineReducers( [(state, action) => reducers.reduce((p,r) => r(p, action), state)] || []);
    const store = createStore(reducer);

    React.render(
        (<div>
            <Provider store={store}>
                {() => <Main url="comments.json" pollInterval={2000} />}
            </Provider>
            {renderDevTools(store)}
        </div>)
    , document.body);

})();
