const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const { userEventModel } = require('../models.js');
const { userAuth } = require('../middleware/userAuth');

const upload = multer({ dest: 'tmp/csv/' });


// hello 
router.get('/', async (req, res) => {
  const event = await userEventModel.findOne({ id: req.body.eventid }).exec();

  if (event == undefined)
    return res.send({ status: 'error', error: 'Event ID does not exist or is not found.' });

  return res.send({ status: 'success', event: event });
})

router.get('/checkin/:event_id/:user_id', userAuth, async (req, res) => {
  const event = await userEventModel.findOne({ id: req.params.event_id }).exec();
  if (event == null)
    return res.send({ error: 'Invalid event.' });

  let response = { status: 'error', msg: 'Participant not found. Please confirm if they have registered in the event.' };
  event.data.forEach(async (user) => {
    if (response.status != 'error') return;
    if (user[event.id_key] == req.params.user_id) {
      user.checked_in = true;
      saveUser = user;
      response = { status: 'success', user: user };
    }
  });
  if (response.status != 'error') {
    const saveEvent = new userEventModel(event);
    await saveEvent.save();
  }
  return res.send(response);
});

router.post('/create',
  upload.single('file'),
  userAuth,
  async (req, res) => {
    let errors = [];
    if (req.file == null) {
      errors.push('NULL_FILE');
    }
    // TODO: Validate ownerId
    if (req.body.owner_id == null) {
      errors.push('NULL_OWNER_ID');
    }
    if (req.body.name == null) {
      errors.push('NULL_EVENT_NAME');
    }
    // TODO: Validate id key existence
    if (req.body.id_key == null) {
      errors.push('NULL_ID_KEY');
    }

    if (errors.length > 0)
      return res.send({ errors: errors });

    const csvData = [];

    console.log(req.file)
    fs.createReadStream(`${req.file.destination}/${req.file.filename}`)
      .pipe(csv())
      .on('data', (data) => {
        data.checked_in = false;
        csvData.push(data);
      })
      .on('end', async () => {
        const newEntry = new userEventModel({
          name: req.body.name,
          owner_id: req.body.owner_id,
          id_key: req.body.id_key,
          data: csvData
        });
        await newEntry.save().then((data) => {
          console.log(`[GALZify] Event created. (id: ${data._id})`);
          console.log(csvData);
          return res.send({
            rows: csvData.length,
            event_id: data._id
          });
        })
      }); // TODO: process into object, then upload to mongo db
  }
);

module.exports = router
