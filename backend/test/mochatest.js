var expect = require("chai").expect;
var request = require("request").defaults({ jar: true });
const { spawn } = require("child_process");
const path = require("path");
const ls = spawn("node", [path.join(__dirname, "..", "server.js")], {
  env: { ...process.env, PORT: 3005 }
});

describe("Twitter", function() {
  this.timeout(10000);

  // runs before all tests in this block
  before(function(done) {
    setTimeout(() => {
      request.post(
        {
          url: "http://localhost:3001/users/login",
          form: { email: "testkafka@gmail.com", password: "password" }
        },
        function(error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        }
      );
    }, 2000);
  });

  after(() => ls.kill("SIGTERM"));

  //test to view bookmarks
  it("Test to view bookmarks", function(done) {
    request(
      {
        url: "http://localhost:3001/bookmarks/",
        json: true
      },
      function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      }
    );
  });

  //test to search
  it("Get results for search", function(done) {
    request(
      {
        url: "http://localhost:3001/userfeed/search",
        qs: { topic: "modi" }
      },
      function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      }
    );
  });

  //test to userfeed tweets
  it("Get results for userfeed tweets", function(done) {
    request(
      {
        url: "http://localhost:3001/userfeed/tweets"
      },
      function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      }
    );
  });

  //test to view profile
  it("Get results for view profile", function(done) {
    request(
      {
        url: "http://localhost:3001/users/profile"
      },
      function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      }
    );
  });

   //test to view memberships
  it("Get results for view list memberships", function(done) {
    request(
      {
        url: "http://localhost:3001/lists/memberships"
      },
      function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      }
    );
  });

  //test to view messages
  it("Get results for view messages", function(done) {
    request(
      {
        url: "http://localhost:3001/messages/"
      },
      function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      }
    );
  });

  //test tweets view count
  it("Get results for tweets view count", function(done) {
    request(
      {
        url: "http://localhost:3001/analytics/viewcount"
      },
      function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      }
    );
  });

  //test create list
  it("Create List", function(done) {
    request.post(
      {
        url: "http://localhost:3001/lists/create",
        form: {
          listName: "mocha users",
          listDesc: "Helps learn mocha",
          isPrivate: 0
        }
      },
      function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      }
    );
  });
  //test for viwing owned lists
  it("Get results for owned list", function(done) {
    request(
      {
        url: "http://localhost:3001/lists/"
      },
      function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      }
    );
  });

  //test for list subscriptions
  it("Get results for list subscriptions", function(done) {
    request(
      {
        url: "http://localhost:3001/lists/subscriptions"
      },
      function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      }
    );
  });
});
