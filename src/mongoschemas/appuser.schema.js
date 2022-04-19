const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: 'this feild is required',
    },
    lastName: {
        type: String,
        required: 'this feild is required',
    },
    email: {
        type: String,
        required: 'this feild is required',
        unique: true,
    },
    password: {
        type: String,
        required: 'this feild is required',
    },
    admin: {
        type: Boolean,
        required: 'this feild is required',
        default: false,
    },
    statistics: {quizzesAttempted: Number, eventsRegistered: Number, averageQuizScore: Number},
    subscribedEvents: [{id: String}]
});

module.exports = mongoose.model('AppUser', userSchema);
