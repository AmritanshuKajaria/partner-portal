const express = require("express");
var path = require("path");
const port = process.env.PORT || 8081;
const app = express();

//Set the base path to the partner-portal dist folder
app.use(express.static(path.join(__dirname, "./dist/partner-portal")));

//Any routes will be redirected to the angular app
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./dist/partner-portal/index.html"));
});

//Starting server on port 8081
app.listen(port, () => {
  console.log("Server started!");
  console.log(port);
});
