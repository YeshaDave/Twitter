var express = require("express");
var router = express.Router();
var passport = require("passport");

const { simulateRequestOverKafka } = require('../KafkaRequestSimulator');
// Set up middleware
var requireAuth = passport.authenticate("jwt", { session: false });

//Shows all chats
router.get("/", requireAuth, async function (req, res, next) {
  try {
    const loggedInUser = req.user;
    receiverID = []
    const messages = {
      senderID: loggedInUser.userID
    };

    results = await simulateRequestOverKafka("getOwnMessages", messages);
    results.forEach(retwt => {
      receiverID.push(retwt.receiverID);
    });

    quoted = "'" + receiverID.join("','") + "'";
    const user = { usersID: [quoted] };
    let chatRes = await simulateRequestOverKafka("getUsers", user);
    res.json(chatRes.results)
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});

// search people for messaging
router.get('/search', requireAuth, async function (req, res, next) {
  const { fname } = req.query;
  try {
    const user = { search: { firstName: fname } };
    const { results } = await simulateRequestOverKafka("getUsers", user);
    res.json(results);
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});

router.post("/send", requireAuth, async function (req, res, next) {
  const { chat, receiverID } = req.body;
  try {
    const loggedInUser = req.user;
    const messages = {
      senderID: loggedInUser.userID,
      chat: chat,
      receiverID: receiverID,
      chatDate: Date.now()
    };
    await simulateRequestOverKafka("sendMessages", messages);
    res.json({ message: "Message Sent" });
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});

//Shows specific chat
router.get("/view", requireAuth, async function (req, res, next) {
  const { receiverID } = req.query;
  try {
    if (receiverID) {
      const loggedInUser = req.user;
      const messages = {
        senderID: loggedInUser.userID,
        receiverID: receiverID
      };
      const results = await simulateRequestOverKafka("getMessages", messages);
      res.json(results);
    }
    else {
      return res.status(400).json({ message: "Bad Request" });
    }

  } catch (e) {
    res.status(500).send(e.message || e);
  }
});


router.post("/delete", requireAuth, async function (req, res, next) {
  const { receiverID } = req.body;
  try {
    const loggedInUser = req.user;
    const messages = {
      senderID: loggedInUser.userID,
      receiverID: receiverID
    };
    await simulateRequestOverKafka("deleteMessages", messages);
    res.json({ message: "Message Deleted" });
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});

module.exports = router;
