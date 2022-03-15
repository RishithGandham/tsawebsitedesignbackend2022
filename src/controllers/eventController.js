const express = require('express');
const  mongoose = require('mongoose');
const router = express.Router();
const Event = mongoose.model('Event')


// get all events
router.get('/', async (req, res) => {
    const events = await Event.find();
    console.log('events retrieved:', events );
    res.send(events);
})


// insert a new event
router.post('/createevent', (req, res) => {
    var event = new Event();
    event.name = req.body.name;
    event.maxTickets = req.body.maxTickets;
    event.ticketsSold = 0
    event.date = req.body.date;
    event.save((err, doc) => {
        if (err) {
            res.status(500).send('Error occured while creating the event');
        } else {
            res.status(200).send(doc);
        }
    })
})


//update an event 
router.post('/update', (req, res) => {
    Event.findOneAndUpdate({ _id: req.body._id}, req.body, (err, doc) => {
        if(err) res.status(500).send('An error occured')
        else res.status(200).send(doc)
    })
})


module.exports = router;
