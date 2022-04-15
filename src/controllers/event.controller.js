//express
const express = require('express');
const router = express.Router();

//mongoose
const mongoose = require('mongoose');
const checkIfAdmin = require('../auth/admincheck.middleware');
const Event = mongoose.model('Event');

//jwt
const jwtMiddleWare = require('../auth/checkjwt.middleware');
const getAppUserFromReq = require('../auth/getappuser.middleware');

// get all events
router.get('/getAll', jwtMiddleWare, async (req, res) => {
    const events = await Event.find();
    res.send(events);
});


//get an event by id
router.get('/getById/:id', jwtMiddleWare, async (req, res) => {
    const event = await Event.findById(req.params.id, (err, event) => {
        if (err) { 
            res.status(400).send(err);
        } else {
            res.send(event);
        }
    });
});

// insert a new event
router.post('/createevent', jwtMiddleWare, checkIfAdmin, (req, res) => {
    var event = new Event();
    event.name = req.body.name;
    event.maxTickets = req.body.maxTickets;
    event.ticketsSold = 0;
    event.date = req.body.date;
    event.img_url = req.body.img_url;
    event.description = req.body.description;
    event.save((err, doc) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error occured while creating the event');
        } else {
            res.status(200).send(doc);
        }
    }); 
});

//update an event
router.post('/update', jwtMiddleWare, checkIfAdmin, (req, res) => {
    Event.findOneAndUpdate({ _id: req.body._id }, req.body, (err, doc) => {
        if (err) res.status(500).send('An error occured');
        else res.status(200).send(doc);
    });
});

//make a user subscribe to an event (increment ticketsSold) 
router.post('/subscribe', jwtMiddleWare, async (req, res) => {
    console.log(req.body);
    const {eventId} = req.body;
    const event = await Event.findById(eventId);
    const user = await getAppUserFromReq(req);
    
    for (let i = 0; i < user.subscribedEvents.length; i++) {
        if (user.subscribedEvents[i]._id.equals(eventId)) {
            return res.status(400).send('You are already subscribed to this event');
        }
    }
    //check if the event is already sold out
    if (event.ticketsSold >= event.maxTickets) {
        return res.status(400).send('This event is sold out');
    }

    if (event.ticketsSold < event.maxTickets) {
        event.ticketsSold++;
        user.subscribedEvents.push(eventId);
        user.save((err, doc) => {
            if (err) return res.status(500).send('An error occured');
        });
        event.save((err, doc) => { 
            if (err) return res.status(500).send('An error occured');
            else return res.status(200).send(doc);
        });
    } else {
        return res.status(400).send('Event is full');
    }
});

//remove a user from an event (decrement ticketsSold)
router.post('/unsubscribe', jwtMiddleWare, async (req, res) => {
    const {eventId} = req.body;
    const event = await Event.findById(eventId);
    const user = await getAppUserFromReq(req);


    let isActuallySubscribed = false;

    // use a for loop to determine if the user is subscribed to the event
    for (let i = 0; i < user.subscribedEvents.length; i++) {
        if (user.subscribedEvents[i]._id.equals(eventId)) {
            isActuallySubscribed = true;
            break;
        }
    }

    if (!isActuallySubscribed) {
        return res.status(400).send('You are not subscribed to this event');
    }

    if (event.ticketsSold > 0) {
        event.ticketsSold--;
        user.subscribedEvents.splice(user.subscribedEvents.indexOf(eventId), 1);
        user.save((err, doc) => {
            if (err) res.status(500).send('An error occured');
        });
        event.save((err, doc) => {
            if (err)  res.status(500).send('An error occured');
            else return res.status(200).send(doc);
        });
    } else {
        return res.status(400).send('Event is empty');
    }
});
module.exports = router;