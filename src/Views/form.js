import React from "react";
import {
  FormControl,
  //FormHelperText,
  InputLabel,
  Input,
  Button,
  Select,
  MenuItem,
  //Paper,
  Typography,
  //FormGroup,
  //FormControlLabel
} from "@material-ui/core";
import axios from 'axios';
//import Popover from '@material-ui/core/Popover';
//import Fade from "@material-ui/core/Fade";
//import Popper from "@material-ui/core/Popper";
//import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';

class Contact extends React.Component {

    constructor(props) {
	super(props);
	this.state = {
	    checked: false
	};
	this.handleSubmit = this.handleSubmit.bind(this);
	this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
	this.setState({
	    checked: event.target.checked
	})
    }

    handleSubmit(event) {
	event.preventDefault();
	const props = this.props;
	const state = this.state;
	axios.post("/api/putRequestData", {
	    name: event.target[0].value,
	    email: event.target[1].value,
      ainfo: event.target[2].value,
	    environment: event.target[3].value,
	    asnos: event.target[5].value.split('\n'),
	    checked: state.checked
	})
	    .then(function (response) {
		if(response.data.success) {
		    const { from } = props.location.state || { from: { pathname: "/" } };
		    props.history.push(from);
		}
		else {
		    alert("Unable to send the fetching request. Please try again.");
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
        <form onSubmit={this.handleSubmit} style={{ width: "50%" }}>
          <h1>Fetching request form</h1>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input id="name" type="text" />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input id="email" type="email" />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="ainfo">Additional Information</InputLabel>
            <Input id="ainfo" type="text" />
          </FormControl>
          <FormControl margin="normal" required fullWidth >
            <InputLabel id="demo-simple-select-label">Environment</InputLabel>
            <Select
//              value=''
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              >
              <MenuItem value={"TES1"}>TES1</MenuItem>
              <MenuItem value={"TES2"}>TES2</MenuItem>
              <MenuItem value={"TES3"}>TES3</MenuItem>
              <MenuItem value={"TEL1"}>TEL1</MenuItem>
              <MenuItem value={"TEL2"}>TEL2</MenuItem>
              <MenuItem value={"TEL3"}>TEL3</MenuItem>
              <MenuItem value={"SY20"}>SY20</MenuItem>
              <MenuItem value={"SY21"}>SY21</MenuItem>
              <MenuItem value={"SY22"}>SY22</MenuItem>
              <MenuItem value={"SY30"}>SY30</MenuItem>
              <MenuItem value={"SY31"}>SY31</MenuItem>
              <MenuItem value={"HY10"}>HY10</MenuItem>
              <MenuItem value={"HL10"}>HL10</MenuItem>
              <MenuItem value={"SL20"}>SL20</MenuItem>
              <MenuItem value={"SL30"}>SL30</MenuItem>
              <MenuItem value={"SL21"}>SL21</MenuItem>
              <MenuItem value={"SL31"}>SL31</MenuItem>
              <MenuItem value={"TEW1"}>TEW1</MenuItem>
              <MenuItem value={"TEW2"}>TEW2</MenuItem>
              <MenuItem value={"TEW3"}>TEW3</MenuItem>
              <MenuItem value={"SW20"}>SW20</MenuItem>
              <MenuItem value={"SW21"}>SW21</MenuItem>
              <MenuItem value={"SW22"}>SW22</MenuItem>
              <MenuItem value={"SW30"}>SW30</MenuItem>
              <MenuItem value={"SW31"}>SW31</MenuItem>
              <MenuItem value={"HW10"}>HW10</MenuItem>
              <MenuItem value={"KW1"}>KW1</MenuItem>
              <MenuItem value={"KOU1"}>KOU1</MenuItem>
              <MenuItem value={"KOU3"}>KOU3</MenuItem>
              <MenuItem value={"KOUL1"}>KOUL1</MenuItem>
              <MenuItem value={"KL30"}>KL30</MenuItem>
            </Select>
          </FormControl>
          <Typography>Is the fetching urgent?</Typography>
          <Checkbox
            checked={this.state.checked}
            onChange={this.handleChange}
            inputProps={{
              'aria-label': 'primary checkbox',
            }}
          />
          <FormControl margin="dense" required fullWidth>
            <InputLabel htmlFor="customer-numbers">Customer numbers</InputLabel>
            <Input id="customer-numbers" multiline rows={10} />
          </FormControl>
          <Button type="submit" variant="contained" color="primary" size="medium">
            Send
          </Button>
        </form>
      </div>
    );
  }
}

export default Contact;
