const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let requestSchema = new Schema({
    name: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100},
    environment: {type: String, required: true, max: 100},
    asnos: {type: Array, required: true},
    asnoCount: {type: String, required: true},
    status: {type: String, required: true, max: 100},
       //startDate --> requestedDate 
    startDate: {type: Date, required: true},
       //startDate ekliyorum fething.model.js'ten gelmesini istiyorum
    startDateOfJob :{type: Date, required: false},
    reasonOfError: {type: String, required: false, max: 400,},
   // startDate: {type: Date, required: true},
    endDate: {type: Date, required: false},
    urgency: {type: Boolean, required: true},
    ainfo: {type: String, required: false}
},{ collection: 'requests' });


// Export the model
module.exports = mongoose.model('Request', requestSchema);
