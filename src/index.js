import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
//import MaterialIcon, {colorPalette} from 'material-icons-react';
import "typeface-roboto";
import './index.css';
// You can choose your kind of history here (e.g. browserHistory)
// Your routes.js file
import App from './Views/App';

ReactDOM.render(
	<App />,
	document.getElementById('root'));
