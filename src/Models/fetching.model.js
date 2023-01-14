const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let fetchingSchema = new Schema({
    environment: {type: String, required: true, max: 100},
    status: {type: String, required: true, max: 100},
    startDateOfJob: {type: Date, required: true},
    endDate: {type: Date, required: false},
    requestid: {type: Schema.Types.ObjectId, required: false}
},{ collection: 'fetching' });


// Export the model
module.exports = mongoose.model('Fetching', fetchingSchema);
