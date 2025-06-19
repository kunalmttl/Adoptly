const express = require('express');
const router = express.Router();

// Main store where pets are listed with sort/filter options


router.get('/', (req, res) => 
{
        res.send("Main store where pets are listed with sort/filter options");
});

module.exports = router;