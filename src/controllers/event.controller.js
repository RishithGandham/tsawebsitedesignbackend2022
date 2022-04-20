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
router.get('/getAll', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json({
            events: events
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});


//get an event by id
router.post('/getById/', async (req, res) => {
    let event;
    try {
        const eventFetch = await Event.findById(req.body.id)
            .then(event1 => {
                event = event1
            }).catch((err) => {
                res.status(400).send('Could not find event');
                console.log('helloadfs')
                throw err;
            });
        return res.status(200).send({
            event: event
        })
    } catch (err) {
        console.log(err)
    }

});

//return all events for a user with the actual data instead of the id
router.get('/getAllForUser', jwtMiddleWare, async (req, res) => {

    async function getEvents() {
        let events = [];
        for (let i = 0; i < req.user.subscribedEvents.length; i++) {
            const event = await Event.findById(req.user.subscribedEvents[i])
                .then(event => {
                    events.push(event);
                }).catch(() => {
                    res.status(400).send('An error occured');
                });
        }
        return events;
    }

    await getEvents().then((events) => {
        console.log(events)
        res.status(200).json({
            events: events
        })
    })



});



// insert a new event
router.post('/createevent', jwtMiddleWare, (req, res) => {
    var event = new Event();
    event.name = req.body.name;
    event.registeredUsers = 0;

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
    try {
        console.log(req.body);
        const { eventId } = req.body;
        const event = await Event.findById(eventId);
        const user = await getAppUserFromReq(req);

        console.log(req.user)

        for (let i = 0; i < user.subscribedEvents.length; i++) {
            if (user.subscribedEvents[i]._id.equals(eventId)) {
                return res.status(400).send('You are already registered to this event');
            }
        }


        event.registeredUsers++;
        user.subscribedEvents.push(eventId);
        user.save((err, doc) => {
            if (err) return res.status(500).send('An error occured');
        });
        event.save((err, doc) => {
            if (err) return res.status(500).send('An error occured');
            else return res.status(200).send(doc);
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send('An error occured');
    }
});

//remove a user from an event (decrement ticketsSold)
router.post('/unsubscribe', jwtMiddleWare, async (req, res) => {
    const { eventId } = req.body;
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

    if (event.registeredUsers > 0) {
        event.registeredUsers--;
        for (let i = 0; i < user.subscribedEvents.length; i++) {
            if (user.subscribedEvents[i]._id.equals(eventId)) {
                user.subscribedEvents.splice(i, 1);
                break;
            }
        }
        user.save((err, doc) => {
            if (err) res.status(500).send('An error occured');
        });
        event.save((err, doc) => {
            if (err) res.status(500).send('An error occured');
            else return res.status(200).send(doc);
        });
    } else {
        return res.status(400).send('Event is empty');
    }
});
module.exports = router;