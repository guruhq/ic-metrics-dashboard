/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */

const fs = require("fs");

module.exports = (app) => {
  app.log("App was loaded!");

  app.on("pull_request.merged", async (context) => {
    context.log("pr merged events log: ", {
      event: context.event,
      action: context.payload.action,
    });

    let data = JSON.stringify(context);
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
    fs.appendFile("all-events-data.json", data, function (err) {
      if (err) throw err;
      app.log("all-events-data.json File Saved!");
    });
    return context.log;
  });
};
