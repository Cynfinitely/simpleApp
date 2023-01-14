import React from 'react';
import { Button } from '@material-ui/core';
//import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import {
  FormControl,
  //FormHelperText,
  InputLabel,
  Input,
  //Select,
  //MenuItem,
  //Typography
} from "@material-ui/core";
import axios from 'axios';

class Loginpage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
		}
		this.handleChange = this.handleChange.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);

	}

	handleChange(event) {
		const { name, value } = event.target;
		this.setState({
			[name]: value
		})
	}

	handleSubmit(event) {
		event.preventDefault();
		const props = this.props;
		const { username, password } = this.state;
		if (!username && password) {
			return;
		}
	    console.log(global.port);
		//axios.post('http://10.16.44.12:8080/api/login', {
    axios.post("/api/login", {
    //axios.post('/login', {
			username: username,
			password: password
		})
			.then(function (response) {
				if(response.data.success) {
					localStorage.setItem('user', response.data.user);
					const { from } = props.location.state || { from: { pathname: "/adminpage" } };
		            props.history.push(from);
				}
				else {
					alert("Wrong username or password");
				}
		})
			.catch(function (error) {
			console.log(error);
		});

	}

    render() {

        return (
        	<div
	        style={{
	          display: "flex",
	          justifyContent: "center",
	          margin: 20,
	          padding: 20
	        }}
	      >
            <form onSubmit={this.handleSubmit}style={{ width: "30%" }}>
          	<h1>Login</h1>
	          <FormControl margin="normal" required fullWidth>
	            <InputLabel htmlFor="username">Username</InputLabel>
	            <Input id="username" type="text" name="username" value={this.state.username} onChange={this.handleChange}/>
	          </FormControl>

	          <FormControl margin="normal" required fullWidth>
	            <InputLabel htmlFor="password">Password</InputLabel>
	            <Input id="password" type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
	          </FormControl>
	          <Button type="submit" variant="contained" color="primary" size="medium">
	            Send
	          </Button>
        	</form>
        </div>
        );
    }
}

export default Loginpage;
