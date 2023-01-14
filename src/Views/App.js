import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'
import Navbar from './navbar';
import Form from './form';
import Mainpage from './mainpage';
import Adminpage from './adminpage';
import Login from './login';
import { PrivateRoute } from '../Components/privateroute';
import { HashRouter as Router, Route } from 'react-router-dom';

class App extends Component {

  render() {
    return (
      <div>
        <Router>
          <div>
            <AppBar color="primary" position="static">
              <Toolbar>
               <Navbar/>
              </Toolbar>
            </AppBar>
            <Route exact path="/"component={Mainpage} />
            <PrivateRoute exact path="/admin" component={Adminpage} />
            <Route path="/form" component={Form} />
            <Route path="/login" component={Login} />
          </div>
        </Router>
      </div>
    );
  }
}
export default App;
