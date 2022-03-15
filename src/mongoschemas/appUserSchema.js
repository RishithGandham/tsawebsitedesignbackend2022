
const mongoose = require('mongoose');


const userSchema = mongoose.Schema( {
    firstName: {
        type: String,
        required: 'this feild is required'
    },
    lastName: {
        type: String,
        required: 'this feild is required'
    },
    email: {
        type: String,
        required: 'this feild is required'
    },
    password: {
      type: String,
      required: 'this feild is required'
    },
    subscribedEvents: [{id: String}],
    createdEvents: [{id: String}]

})

module.exports = mongoose.model('AppUser', userSchema);

