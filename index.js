/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */

const fs = require("fs");

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

// App's Firebase project configuration
var firebaseConfig = {
  apiKey: "AIzaSyBUbpjkfcX2DTDVfCugwhK0pyL3msJw_KY",
  authDomain: "guru-metrics-dashboard.firebaseapp.com",
  databaseURL: "https://guru-metrics-dashboard.firebaseio.com",
  projectId: "guru-metrics-dashboard",
  storageBucket: "guru-metrics-dashboard.appspot.com",
  messagingSenderId: "513650345220",
  appId: "1:513650345220:web:758e001112ee5d31263c51",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

module.exports = (app) => {
  // Get a top level express router to expose new HTTP endpoints
  const router = app.route("/home");

  // Use express middleware
  router.use(require("express").static("public"));

  app.log("App was loaded!");

  app.on("pull_request.merged", async (context) => {
    context.log("pr merged events log: ", {
      event: context.event,
      action: context.payload.action,
    });

    let data = JSON.stringify(context);

    // Send data to /home/pr route
    router.get("/pr", (req, res) => {
      res.send(data);
    });

    fs.appendFile("pr-merged-events-data.json", data, function (err) {
      if (err) throw err;
      app.log("pr-merged-events-data.json File Saved!");
    });
    return context.log;
  });

  app.on("push", async (context) => {
    context.log("push events log: ", {
      event: context.event,
      action: context.payload.action,
    });

    let data = JSON.stringify(context);

    // Send data to /home/push route
    router.get("/push", (req, res) => {
      res.send(data);
    });

    fs.appendFile("push-events-data.json", data, function (err) {
      if (err) throw err;
      app.log("push-events-data.json File Saved!");
    });
    return context.log;
  });

  app.on("*", async (context) => {
    context.log("all events log: ", {
      event: context.event,
      action: context.payload.action,
    });

    let data = JSON.stringify(context);

    // Send data to /home/all route
    router.get("/all", (req, res) => {
      res.send(data);
    });
    if (context.event === "status") {
      fs.appendFile("status-data.json", data, function (err) {
        if (err) throw err;
        app.log("status-data.json File Saved!");
      });
      return context.log;
    } else {
      fs.appendFile("all-events-data.json", data, function (err) {
        if (err) throw err;
        app.log("all-events-data.json File Saved!");
      });
      return context.log;
    }
  });
};
