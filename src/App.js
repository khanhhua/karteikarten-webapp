import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router';
import 'bootstrap/scss/bootstrap.scss';

import appHistory from './appHistory';
import configureStore from './store';

import LoginPage from './pages/LoginPage';
import CreateCollectionPage from './pages/CreateCollectionPage';
import CollectionListPage from './pages/CollectionListPage';
import CollectionEditPage from './pages/CollectionEditPage';
import CollectionReviewPage from './pages/CollectionReviewPage';

const store = configureStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={appHistory}>
          <Switch>
            <Route path="/login" exact component={LoginPage} />
            <Route path="/create-collection" exact component={CreateCollectionPage} />
            <Route path="/create-collection/:step" exact component={CreateCollectionPage} />
            <Route path="/collections" exact component={CollectionListPage} />
            <Route path="/collections/:collectionId" exact component={CollectionEditPage} />
            <Route path="/review/result" exact component={CollectionReviewPage} />
            <Route path="/review/:collectionId" exact component={CollectionReviewPage} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
