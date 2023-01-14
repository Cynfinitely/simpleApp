const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let errorReportSchema = new Schema({
    name: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100},
    environment: {type: String, required: true, max: 100},
    additionalInfo:{type: String, required: true, max:300},
    //status: {type: String, required: true, max: 100},
    reasonOfError: {type: String, required: false, max: 400},
    startDateOfJob: {type: Date, required: true},
    errorDate: {type: Date, required: false},
   
},{ collection: 'errorReports' });


// Export the model
module.exports = mongoose.model('ErrorReport', errorReportSchema);
