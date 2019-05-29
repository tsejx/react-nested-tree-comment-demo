import React from 'react';
import './App.css';
import Navigation from './components/Navigation.js';
import Heading from './components/Heading.js';
import CommentList from './components/CommentList.js';
export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="container">
          <Navigation />
          <div className="content">
            <Heading />
            <CommentList />
          </div>
        </div>
      </div>
    );
  }
}
