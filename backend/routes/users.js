var express = require('express');
var router = express.Router();

const { getUsers } = require('../DataAccessLayer');

/* get all users test route */
router.get('/', async function (req, res, next) {
  try {
    const { results } = await getUsers();
    res.json(results);
  }
  catch (e) {
    res.status(500).send(e.message || e);
  }
});

module.exports = router;
