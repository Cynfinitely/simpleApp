const express = require('express');
const app = express();
global.port = process.env.PORT || 8080;
const hostname = process.env.HOST || '127.0.0.1';
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const router = express.Router();
const path = require('path');
const rfs = require('rotating-file-stream')
const dbRoute = 'mongodb://127.0.0.1:27017/myapp';

const Fetching = require('./src/models/fetching.model');
const Request = require('./src/models/request.model');
const ErrorReport=require('./src/models/errorReport.model');


// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true,
			    useUnifiedTopology: true});

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
})
app.use(logger(':date[iso] :remote-addr :method :url :status :response-time ms - :res[content-length]',
	       { stream: accessLogStream }) );
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// These priorities are used when urgent fetching are sorted.
// priorities[0] has highest priority then comes priorities[1], priorities[2] and finally other environments
const priorities = [
    ["TES1", "TEL1", "TEW1"],
    ["HY10", "HL10", "HW10"],
    ["SY21", "SL21", "SW21"]
];

// Merge the data into a single list using the environment list as index
const mergeData = (data, environments) => environments.map(environment => {
    const obj = {};
    obj.environment = environment;
    obj.asnos = [];
    //init the grid matrix
    //React CSV downloader requires the data to be of type array of arrays, thus we are makign the asno array like [[123,124]]
    for ( var i = 0; i < 1; i++ ) {
	obj.asnos[i] = [];
    }

    data.forEach(record => {
	if (record.environment === environment) {
	    record.asnos.forEach(asno => {
		// Push the asnos into the inner array [[0]]
		obj.asnos[0].push(asno);
	    });
	}
    });
    // remove duplicates
    obj.asnos[0] = obj.asnos[0].filter((item, i, ar) => ar.indexOf(item) === i);
    return obj;
});

//Helper function to create an environment look up list e.g. ["tes1", "HY10"]
const getUniqueEnvironments = data => data.reduce((a, c) => {
  if (!a.includes(c.environment)) {
    a.push(c.environment);
  }

  return a;
}, []);

// Modify the array of objects to only contain the next 3 unique environments for the "Next Fetching"-window
function testFunction(array) {
	var uniq = {}
	var arrFiltered = array.filter(obj => !uniq[obj.environment] && (uniq[obj.environment] = true));
	if(arrFiltered.length > 3) {
		arrFiltered = arrFiltered.slice(0,3)
	}
	return arrFiltered;
}

function sortByUrgencyPriority(a, b){
	// this sorting is used for admin page only, it defines execution order of request
	// if urgency is checked then precedes every non urgency request
    if ( a.urgency == true && b.urgency == false )
	return -1;
    if ( a.urgency == false && b.urgency == true )
	return 1;
	// if both have urgency then sort by priority
    if ( a.urgency == true && priorities[0].includes(a.environment) && !priorities[0].includes(b.environment))
	return -1;
    if ( a.urgency == true && !priorities[0].includes(a.environment) && priorities[0].includes(b.environment))
	return 1;
    if ( a.urgency == true && priorities[1].includes(a.environment) && !priorities[1].includes(b.environment))
	return -1;
    if ( a.urgency == true && !priorities[1].includes(a.environment) && priorities[1].includes(b.environment))
	return 1;
    if ( a.urgency == true && priorities[2].includes(a.environment) && !priorities[2].includes(b.environment))
	return -1;
    if ( a.urgency == true && !priorities[2].includes(a.environment) && priorities[2].includes(b.environment))
	return 1;
	// if nothing else matches then sort by requestedDate
	return a.startDate - b.startDate;
}


router.get('/getActiveFetchingData', (req, res) => {
	Fetching.find({status: "In Fetching"}, function(err, data){
		if(err){
			return res.json({ success: false, error: err });
		}
		else {
			res.json({ success: true, data: data });
		}
	})
});

router.get('/getPastFetchingData', (req, res) => {
    Fetching.find({status: "Complete"}, function(err, data){
		if(err){
			return res.json({ success: false, error: err });
		}
		else {
			res.json({ success: true, data: data });
		}

	}).sort({ "startDateOfJob" : -1 }).sort({ "startDateOfJob" : -1 }).limit(7)
});

router.get('/getUnfinishedFetchingData', (req, res) => {
	Request.find({status: { $in: ["Pending", "In Fetching"]}}, function(err, data){
		if(err){
			return res.json({ success: false, error: err });
		}
		else {
			// sort result by urgency and environment
			data.sort(function(a, b){
			return sortByUrgencyPriority(a, b);
		});
		//const result = testFunction(data);
		res.json({ success: true, data: data });
	}
})
});

router.get('/getNextFetchingData', (req, res) => {
	Request.find({status: "Pending"}, function(err, data){
		if(err){
			return res.json({ success: false, error: err });
		}
	    else {
		// sort result by urgency and environment
			data.sort(function(a, b){
				return sortByUrgencyPriority(a, b);
			});
			const result = testFunction(data);
			res.json({ success: true, data: result });
		}

	}).select("-asnos").sort({"urgency": -1 })
});

router.get('/getRequestsData', (req, res) => {
	Request.find( function(err, data){
		if(err){
			return res.json({ success: false, error: err });
		}
		else {
			res.json({ success: true, data: data });
		}

	}).select(["-asnos", "-_id"]);
});

// This is called from Admin page
// returns all pending events
router.get('/getPendingRequests', (req, res) => {
    Request.find({status: "Pending"}, function(err, data){
	if(err){
	    return res.json({ success: false, error: err });
	}
	else {
	    data.sort(function(a,b){
		return sortByUrgencyPriority(a, b);
	    });
	    const environments = getUniqueEnvironments(data);
	    const result = mergeData(data, environments);
	    res.json({ success: true, data: result });
	}
    });
});

    /*
app.get('/getPendingRequests', (req, res) => {
	Request.find({status: "Pending"}, function(err, data){
		if(err){
			return res.json({ success: false, error: err });
		}
		else {
			const environments = getUniqueEnvironments(data);
			const result = mergeData(data, environments);
			res.json({ success: true, data: result });
		}
    // Sorting here, first urgency cases
    // Urgency cases are sorted based on environment
	}).sort({"urgency": -1 })
});
    */
// Fetching status: In Fetching, Completed
// New fetching is always In Fetching, when ending a fetching it is set to Completed
// Request status: Pending, In Fetching, Completed
// New request is always Pending. When fetching starts: In Fetching. When ending a fetching it is set to Completed.

router.post('/putFetchingData', (req, res) => {
	let data = new Fetching();

	const { environment } = req.body;

	data.environment = environment;
	data.status = "In Fetching";
	data.startDateOfJob = new Date().toISOString();
	data.endDate = null;
	data.save((err) => {
	if (err) {
		console.log(err);
		return res.json({ success: false, error: err });
	}
	else {
		const request = Request.updateMany({ environment: environment, status: "Pending" }, { status: "In Fetching" }, function(err, data) {
			if(err)
				return res.json({ success: false, error: err });

			return res.json({ success: true });
		})
	}
	});
});

router.post('/startFetching', (req, res) => {
	let data = new Fetching();
	const { environment, _id } = req.body;
	data.environment = environment;
	data.status = "In Fetching";
	data.startDateOfJob = new Date().toISOString();
	data.endDate = null;
	data.requestid = _id;
	data.save((err) => {
		if (err) {
			console.log(err);
			return res.json({ success: false, error: err });
		}
		else {
			const request = Request.updateMany({ _id: _id, environment: environment, status: "Pending" }, { status: "In Fetching" , startDateOfJob: new Date().toISOString()}, function(err, data) {
				if(err)
				  return res.json({ success: false, error: err });
			  return res.json({ success: true });
			})
		}
	})
});

router.post('/finishFetching', (req, res) => {
	const { environment } = req.body;

	if (!environment) {
		return res.json({
		  success: false,
		  error: 'INVALID INPUTS',
		});
	}
	const request1 = Request.updateMany({ environment: environment, status: "In Fetching" }, { status: "Complete", endDate: new Date().toISOString() }, function(err, data) {
		if(err)
			return res.json({ success: false, error: err });
	})
	const request2 = Fetching.updateMany({ environment: environment, status: "In Fetching" }, { status: "Complete", endDate: new Date().toISOString() }, function(err, data) {
		if(err)
			return res.json({ success: false, error: err });
		else {
			return res.json({ success: true });
		}
	})
});

router.post('/setFetchingComplete', (req, res) => {
	const { _id } = req.body;
	if (!_id) {
		return res.json({
		  success: false,
		  error: 'INVALID INPUTS',
		});
	}
	const request1 = Request.updateMany({ _id: _id, status: "In Fetching" }, { status: "Complete", endDate: new Date().toISOString() }, function(err, data) {
		if(err)
			return res.json({ success: false, error: err });
	})
	const request2 = Fetching.updateMany({ requestid: _id, status: "In Fetching" }, { status: "Complete", endDate: new Date().toISOString() }, function(err, data) {
		if(err)
			return res.json({ success: false, error: err });
		else {
			return res.json({ success: true });
		}
	})
})

router.post('/cancelRequest', (req, res) => {
	const { _id } = req.body;
	if ( !_id ) {
		return res.json({
			success: false,
			error: 'INVALID INPUTS'
		});
		console.log('Invalid inputs');
	}
	const request1 = Request.updateMany({ _id: _id }, { status: "Cancelled", endDate: new Date().toISOString() }, function(err, data) {
		if (err)
		  return res.json({ success: false, error: err });
		else
		  return res.json({ success: true});
	});
	console.log('Cancel request, id= ' + _id);
});

router.post('/putRequestData', (req, res) => {
	let data = new Request();
	//console.log(req.body);
	const { name, environment, email, asnos, checked, ainfo } = req.body;

	if ((!name && name =="") || !environment) {
		return res.json({
		  success: false,
		  error: 'INVALID INPUTS',
		});
	}
	data.name = name;
	data.environment = environment;
	data.email = email;
	data.asnos = asnos;
	data.urgency = checked;
	data.asnoCount = asnos.length;
	data.status = "Pending";
	data.startDate = new Date().toISOString();
	data.endDate = null;
	data.startDateOfJob=null;
	data.ainfo = ainfo;
	data.save((err) => {
	if (err) return res.json({ success: false, error: err });
		return res.json({ success: true });
	});
});


//api post for error //this errorReport post api has been added as a new feature : fehmi.selcuk
router.post('/errorReport', (req, res) => {
	console.log('I AM HERE!!');
	let data = new ErrorReport();

	//console.log(req.body);
	const { name, environment, email, reasonOfError, startDateOfJob, errorDate,additionalInfo } = req.body;

	if ((!name && name =="") || !environment) {
		return res.json({
		  success: false,
		  error: 'INVALID INPUTS',
		});
	}
	data.name = name;
	data.environment = environment;
	data.email = email;
	data.reasonOfError = "HERE WORKING";
	data.startDateOfJob=null;
	data.errorDate = null;
	data.additionalInfo = null;
	data.save((err) => {
	if (err) return res.json({ success: false, error: err });
		return res.json({ success: true });
	});
});


router.get('/getErrorReport' , (req, res)=> {
	Error.find({status: "Error Report"}, function(err, data){
		if(err){
			return res.json({success :false, error: err });
		}
		else{
			res.json({success:true, data:data});
		}
	}).sort({ "errorDate" : -1 }).sort({ "errorDate" : -1 }).limit(7)
})




router.post('/login', (req, res) => {
  //console.error(req.body)
  //return res.json({success: true});
	const { username, password } = req.body;
	if(username == "tdmadmin" && password == "bom@dia123") {
		secret = username+password+"secret123";
		user = Buffer.from(secret).toString('base64')
		return res.json({ success: true, user: user})
	}
	else {
		return res.json({success: false});
	}

});

app.use('/api', router);

//app.listen(port, "10.16.44.12", () => console.log(`Listening on port ${port}`));
app.listen(port, "0.0.0.0", () => { console.log(`Listening on port ${port}`) });
