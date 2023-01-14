import React, { Component } from 'react';
//import { StyleSheet } from 'react-native';
//import Table from '@material-ui/core/Table';
//import TableBody from '@material-ui/core/TableBody';
//import TableCell from '@material-ui/core/TableCell';
//import TableHead from '@material-ui/core/TableHead';
//import TableRow from '@material-ui/core/TableRow';
//import {  makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from "@material-ui/core/Card";
import { Typography } from "@material-ui/core";
import MaterialTable from 'material-table';
import CardContent from "@material-ui/core/cardcontent";

import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
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
ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

//const cellstyle = {
//	padding: '5px',
//};

class Mainpage extends Component {

	constructor(props) {
		super(props)
		this.state = {
			dataArray: [],
			fetchingDataArray: [],
			pastFetchingArray: [],
			nextFetchingArray: [],
			//dataArray2: dataArray.push(fetchingDataArray)
			//burdan devam et
		}
	}

	getDataFromDb = () => {
    	//fetch('http://10.16.44.12:8080/api/getRequestsData')
		fetch('/api/getRequestsData')
      		.then((data) => data.json())
      		.then((res) => this.setState({ dataArray: res.data }));
  	};
  	getFetchingStatus = () => {
  		//fetch('http://10.16.44.12:8080/api/getActiveFetchingData')
		fetch('/api/getActiveFetchingData')
      		.then((data) => data.json())
      		.then((res) => this.setState({ fetchingDataArray: res.data }));
  	};

	getPastFetchingData = () => {
  		//fetch('http://10.16.44.12:8080/api/getPastFetchingData')
		fetch('/api/getPastFetchingData')
      		.then((data) => data.json())
      		.then((res) => this.setState({ pastFetchingArray: res.data }));
  	};

  	getNextFetchingData = () => {
			//fetch('http://10.16.44.12:8080/api/getNextFetchingData')
  		fetch('/api/getNextFetchingData')
      		.then((data) => data.json())
      		.then((res) => this.setState({ nextFetchingArray: res.data }));
  	};

	componentDidMount() {
	    this.getDataFromDb();
	    this.getFetchingStatus();
		this.getPastFetchingData();
		this.getNextFetchingData();
	}

	render() {



		// on complete
		// startDate of X has gone
		// startDate of doc has change to be startDate from X
		//console.log('Data Array',this.state.dataArray)
		//console.log('fetching Data Array', this.state.fetchingDataArray)

		// const dataArrayNew = this.state.dataArray.map((x, i) => {
		// 	const doc = this.state.pastFetchingArray.find(y=> y.environment === x.environment)
		// 	if (doc){
		// 		return {
		// 			...x,
		// 			requestedDate: x.startDate,
		// 			startDate: doc.startDate,
		// 		}
		// 	}
		// 	return x
		// })
		//console.log('dataArray', dataArrayNew)
		
		// var result = [...[dataArray, this.state.pastFetchingArray].reduce((m, a) => 
		// (a.forEach(o => m.has(o.environment) && Object.assign(m.get(o.environment), o) || m.set(o.environment, o)), m), 
		// new Map).values()];

		// console.log('result', result)
		
		//var finalObj = this.state.dataArray.concat(this.state.pastFetchingArray);
		//console.log('finalObj',finalObj)

		console.log('dataArray', this.state.dataArray)
	
	return (
	<Grid container spacing={0.5}>
		<Grid item xs={3}>
			<Typography gutterBottom variant="h5" component="h2" style={{ marginLeft: 15, marginTop: 15 }} >Active fetching</Typography>

			{this.state.fetchingDataArray.length <= 0
				?
				<Card className = "root">
					<CardContent>
						<Typography gutterBottom variant="h5" component="h2">
							No active fetching!
						</Typography>
					</CardContent>
				</Card>
			:this.state.fetchingDataArray.map(fetchData => (
				<Card className = "root">
					<CardContent>
						<Typography gutterBottom variant="h5" component="h2">
							{fetchData.environment}
						</Typography>
						<Typography component="p">Status: {fetchData.status}</Typography>
				    <Typography component="p">Start date: {fetchData.startDateOfJob?.slice(0, 16).replace('T', ',  Time:')}</Typography>
					</CardContent>
				</Card>
			))}
			<Typography gutterBottom variant="h5" component="h2" style={{ marginLeft: 15, marginTop: 15 }} >Next fetching</Typography>
			{this.state.nextFetchingArray.length <= 0
				?
				<Card className = "root">
					<CardContent>
						<Typography gutterBottom variant="h5" component="h2">
							No fetching in queue!
						</Typography>
					</CardContent>
				</Card>
			:this.state.nextFetchingArray.map(fetchData => (
				<Card className = "root">
					<CardContent>
						<Typography gutterBottom variant="h5" component="h2">
							{fetchData.environment}
						</Typography>
						{fetchData.urgency ?
							<Typography color="secondary" component="p">Urgent fetching !</Typography>
							:
							<Typography color="primary" component="p">Non-urgent fetching !</Typography>
						}
						<Typography component="p">Status: {fetchData.status}</Typography>
				<Typography component="p">Request date: {fetchData.startDate.slice(0, 16).replace('T', ',  Time:')}</Typography>
					</CardContent>
				</Card>
			))}
			<Typography gutterBottom variant="h5" component="h2" style={{ marginLeft: 15, marginTop: 15 }} >Past fetchings</Typography>
			{this.state.pastFetchingArray.length <= 0
				?
				<Card className = "root">
					<CardContent>
						<Typography gutterBottom variant="h5" component="h2">
							No fetching history found!
						</Typography>
					</CardContent>
				</Card>
			:this.state.pastFetchingArray.map(pastData => (
				<Card className = "root">
					<CardContent>
						<Typography gutterBottom variant="h5" component="h2">
							{pastData.environment}
						</Typography>
						<Typography component="p">Status: {pastData.status}</Typography>
						<Typography component="p">Start date: {pastData.startDateOfJob?.slice(0, 16).replace('T', ',  Time:')}</Typography>
						<Typography component="p">End date: {pastData.endDate?.slice(0, 16).replace('T', ',  Time:')}</Typography>
					</CardContent>
				</Card>
			))}
		</Grid>
		
		<Grid item xs={9}>
			<Card style={{margin: '15px', padding:'23px '}}><Typography style={{fontWeight: 'bold', fontSize: '1.2rem'}}>Reason of Error<br/></Typography></Card>
			
			<Paper className = "root"> 
			<MaterialTable 
			icons={tableIcons}
			title="Fetching Requests"
			style={{padding: '0px'}}
			columns={[
				{ title: 'Env.', field: 'environment', cellStyle: {fontWeight: 'bold',paddingRight: '5px',}, },
				{ title: 'Email', field: 'email' },
			    { title: 'Name', field: 'name' },
				{ title: 'Additional Information', field: 'ainfo' },
			    { title: 'Asno Count', field: 'asnoCount', type: 'numeric' },
			    //the column name changed from startName to requestedDate
				{ title: 'Requested Date', field: 'startDate', type:'date time', defaultSort: 'desc', },
				//this columns has been added as a new feature : fehmi.selcuk
				//burda dur
				{ title: 'Starting Date of the Job', field: 'startDateOfJob' , type: 'date time' },
				{ title: 'Completion Date of the Job', field:'endDate', type: 'date & time', },
				{ title: 'Status', field: 'status', },
				{ title: 'Urgency', field:'urgency', type: 'boolean', }
			]}
			data={this.state.dataArray}
			options={{
				search: true,
				pageSize: 20
			}}
			/>  
			
			</Paper>

		</Grid>

	</Grid>
  	);
}
}

export default Mainpage;

/*<Paper className = "root">
	<Table>
		<TableBody>
			<TableRow>
				<TableCell style={cellstyle}>HY10</TableCell>
				<TableCell style={cellstyle}>urgent</TableCell>
				<TableCell style={cellstyle}>2021-03-11</TableCell>
			</TableRow>
		</TableBody>
	</Table>
</Paper>*/
