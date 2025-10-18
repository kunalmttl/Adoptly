// # Contact Router

const express           = require('express');
const router            = express.Router();
const contactController = require('../controllers/contactController');
const isLoggedIn        = require('../middlewares/isLoggedIn');


// * @route   POST /api/v1/contact
// * @desc    Send an email to another user
// * @access  Private
router.post('/', isLoggedIn, contactController.sendEmail);

module.exports = router;