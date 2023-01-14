import React, { Component } from 'react';
//import Table from '@material-ui/core/Table';
//import TableBody from '@material-ui/core/TableBody';
//import TableCell from '@material-ui/core/TableCell';
//import TableHead from '@material-ui/core/TableHead';
//import TableRow from '@material-ui/core/TableRow';
//import Paper from '@material-ui/core/Paper';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
//import Card from "@material-ui/core/Card";
//import { Typography } from "@material-ui/core";
import MaterialTable from 'material-table';
//import CardContent from "@material-ui/core/CardContent";
//import CardActionArea from "@material-ui/core/CardActionArea";
//import CardActions from "@material-ui/core/CardActions";
//import Button from "@material-ui/core/Button";
//import {
  //FormControl,
  //FormHelperText,
  //InputLabel,
  //Input,
  //Select,
  //MenuItem
//} from "@material-ui/core";
import { CSVLink } from "react-csv";
//import { CSVLink, CSVDownload } from "react-csv";
import axios from 'axios';

import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import { Dialog, DialogTitle } from '@material-ui/core';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Input from '@material-ui/icons/Input';
import Save from '@material-ui/icons/Save';
import Cancel from '@material-ui/icons/Cancel';
import useState  from 'react';

const tableIcons = {
Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
Input: forwardRef((props, ref) => <Input {...props} ref={ref} />),
Save: forwardRef((props, ref) => <Save {...props} ref={ref} />),
Cancel: forwardRef((props, ref) => <Cancel {...props} ref={ref} />)
};

class Adminpage extends Component {

	constructor(props) {
		super(props)
		this.state = {
			dataArray: [],
			fetchingDataArray: [],
      unfinishedDataArray: [],
      asnosToLoad: [],
		}
		this.handleFinishSubmit = this.handleFinishSubmit.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
    this.csvLinkEl = React.createRef();
	}

	handleSubmit(event) {
		event.preventDefault();
		const props = this.props;
		axios.post('/api/putFetchingData', {
			environment: event.target[0].value,
		})
		.then(function (response) {
			if(response.data.success) {
				const { from } = props.location.state || { from: { pathname: "/" } };
				props.history.push(from);
			}
			else {
				alert("Error");
			}
		})
		.catch(function (error) {
			alert("Error");
		});

	}

	handleFinishSubmit(id) {
		const props = this.props;
		axios.post('/api/finishFetching', {
			environment: id,
		})
			.then(function (response) {
			const { from } = props.location.state || { from: { pathname: "/" } };
      		props.history.push(from);
		})
			.catch(function (error) {
			console.log(error);
		});
	}

  finishFetching(id) {
    const props = this.props;
    axios.post('/api/setFetchingComplete', {
      _id: id,
    })
    .then(function (response) {
      const { from } = props.location.state || { from: { pathname: "/" } };
      props.history.push(from);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  startFetching(environment, requestid) {
    const props = this.props;
    axios.post('/api/startFetching', {
      _id: requestid,
      environment: environment,
    })
    .then(function (response) {
      const { from } = props.location.state || { from: { pathname: "/" } };
      props.history.push(from);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  cancelRequest(id) {
    const props = this.props;
    axios.post('/api/cancelRequest', {
      _id: id,
    })
    .then(function (response) {
      const { from } = props.location.state || { from: { pathname: "/" } };
      props.history.push(from);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  reportError(id){
    const props = this.props;
    console.log('WORKING!')
    console.log(id)
    var error = prompt("What is the error?")
    if (error){
      console.log(error)
    }else{console.log("wrong input!")}
    
    
    
    axios.post('/api/errorReport',{_id: id, reasonOfError: error,
    }).then(function (response) {
      const { from } = props.location.state || { from: { pathname: "/" } };
      props.history.push(from);
    })
    .catch(function (error) {
      console.log(error);
    });

  }




	getDataFromDb = () => {
    	    fetch('/api/getPendingRequests')
      		.then((data) => data.json() )
      		.then((res) => {
		    this.setState({ dataArray: res.data });
		});
  	};

  getFetchingStatus = () => {
  	    fetch('/api/getActiveFetchingData')
      		.then((data) => data.json())
      		.then((res) => {

		    this.setState({ fetchingDataArray: res.data });
		});
  	};

  getUnfinishedRequests = () => {
    fetch('/api/getUnfinishedFetchingData')
    .then((data) => data.json())
    .then((res) => {
      this.setState({ unfinishedDataArray: res.data });
    });
  };


	componentDidMount() {
	    this.getDataFromDb();
	    this.getFetchingStatus();
      this.getUnfinishedRequests();
      //this.setState({ asnosToLoad: { environment: "", asnos: "" }});
	}

  downloadAsnos(data) {
    const obj = {};
    obj.environment = data.environment;
    var asnos = "";
    data.asnos.forEach(asno => {
      asnos = asnos + asno + "\n";
    });
    obj.asnos = asnos;
    this.setState({ asnosToLoad: obj }, () => {
      setTimeout(() => {
        this.csvLinkEl.current.link.click();
      });
    });

  }

	render() {

	return (

	<Grid container >

		<Grid item xs={"auto"}>
      <Paper className = "root">
        <MaterialTable
        icons={tableIcons}
        title="Pending or Unfinished Requests"
        style={{padding: '0px'}}
        columns={[
  				{ title: 'Environment', field: 'environment',
  				cellStyle: {
  					fontWeight: 'bold',
            paddingRight: '8px',
  				}, },
  				{ title: 'Email', field: 'email' },
  			  { title: 'Name', field: 'name' },
  				{ title: 'Additional Information', field: 'ainfo' },
  			  { title: 'Asno Count', field: 'asnoCount', type: 'numeric' },
  			  { title: 'Start Date', field: 'startDateOfJob', type: 'date'},
				  { title: 'Completion Date', field: 'endDate', type: 'date', },
  				{ title: 'Status', field: 'status'},
  				{ title: 'Urgency', field: 'urgency', type: 'boolean'}
  			]}
        options={{
  				search: true,
          sorting: false,
          //selection: true,
  				pageSize: 10,
          actionsColumnIndex: -1
  			}}
        data={this.state.unfinishedDataArray}
        actions={[
        {
          tooltip: 'Download ASNOs',
          icon: tableIcons.Save,
          onClick: (evt, rowData) => { if ( window.confirm('Download Asnos?') ) this.downloadAsnos(rowData) }
        },
        rowData => ({
          tooltip: 'Start Fetching',
          icon: tableIcons.Input,
          onClick: (evt, rowData) => { if ( window.confirm('Start Fething?') ) this.startFetching(rowData.environment, rowData._id) },
          hidden: rowData.status !== 'Pending'
        }),
        rowData => ({
          tooltip: 'Finish Fetching',
          icon: tableIcons.Check,
          onClick: (evt, rowData) => { if ( window.confirm('Finish Fething?') ) this.finishFetching(rowData._id) },
          hidden: rowData.status !== 'In Fetching'
        }),
        rowData => ({
          tooltip: 'Cancel request',
          icon: tableIcons.Cancel,
          onClick: (evt, rowData) => { if ( window.confirm('Cancel Request?') ) this.cancelRequest(rowData._id) },
          hidden: rowData.status === 'In Fetching'
        }),
        //yeni ozellik
         rowData => ({
           tooltip: 'Report Error',
           icon: tableIcons.Edit,
           onClick: (evt , rowData) => { if ( window.confirm('Report Error?') ) this.reportError(rowData._id) },
          hidden: rowData.status === 'Pending'
        }),
        
        


      ]}
        />
        <CSVLink data={"" + this.state.asnosToLoad.asnos} filename={this.state.asnosToLoad.environment+".csv"}  separator={"\n"} enclosingCharacter={`'`} ref={this.csvLinkEl} />
      </Paper>

		</Grid>
	</Grid>
  	);
}
}

export default Adminpage;

