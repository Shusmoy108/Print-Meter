const express = require("express");
const router = express.Router();
const Handlebars = require("handlebars");
const Design = require("../model/DesignInput");

router.get("/", (req, res) => {
  res.render("desigUi");
});

router.post("/design", (req, res) => {
  console.log(req.body);
  Design.insertdesign(req.body, (status, err, design) => {
    if (status === 200) {
      res.render("printpage", { design: design });
    }
  });
});
Handlebars.registerHelper("designpage", function(design) {
  let part1 = "<div class='row '><div class='col-sm-offset-2'>";
  let top =
    "<div class='row ' style='margin-bottom:3%'><div class='col-sm-offset-2'>" +
    "<div class='col-sm-6' style='font-size:20px'> Date : " +
    new Date().toDateString() +
    "</div>" +
    "<div class='col-sm-6' style='font-size:20px'>Machine Number : 5</div>" +
    "</div></div>";
  var jobid = "";
  jobid =
    jobid +
    "<div class='col-sm-4'><table class=\"table table-bordered \" id='result'>\n" +
    "    <thead><tr>\n" +
    "        <th colspan='3' style='text-align:center'>Job ID</th>\n</tr><tr>" +
    "        <th >Invoice Number</th>\n" +
    "        <th>Item Number</th>\n" +
    "        <th>Plate Number</th></tr>\n<tbody><td>" +
    design.invoiceNumber +
    "</td>" +
    "<td>" +
    design.itemNumber +
    "</td>" +
    "<td>" +
    design.plateNumber +
    "</td>";

  jobid = jobid + "</tbody></table></div>";
  var deadline = "";
  deadline =
    deadline +
    "<div class='col-sm-4 col-xs-offset-1'><table class=\"table table-bordered \" id='result'>\n" +
    "    <thead><tr>\n" +
    "        <th colspan='2' style='text-align:center'>Deadline</th>\n</tr><tr>" +
    "        <th >Date</th>\n" +
    "        <th>Time</th>\n" +
    "      <tbody><td>" +
    new Date(design.deadline).toDateString() +
    "</td>" +
    "<td>" +
    new Date(design.deadline).toLocaleTimeString() +
    "</td>";

  deadline = deadline + "</tbody></table></div>";
  part1 = part1 + jobid + deadline + "</div></div>";
  var side = "";
  side =
    side +
    "<div class='col-sm-4 '><table class=\"table table-bordered \" id='result'>\n" +
    "    <thead><tr>\n" +
    "        <th >Side</th>\n" +
    "        <th >Sheet</th>\n" +
    "        <th>Impression</th>\n" +
    "      </tr><tbody><td>" +
    design.side +
    "</td>" +
    "<td>" +
    design.sheet +
    "</td>" +
    "<td>" +
    design.impressions +
    "</td>";

  side = side + "</tbody></table></div>";
  var paper = "";
  paper =
    paper +
    "<div class='col-sm-4 col-xs-offset-1'><table class=\"table table-bordered \" id='result'>\n" +
    "    <thead><tr>\n" +
    "        <th colspan='2' style='text-align:center'>Paper Size</th>\n<th colspan='2' style='text-align:center'>Gripper</th></tr>" +
    "      \n<tbody><td>" +
    design.paperLength +
    "</td>" +
    "<td>" +
    design.paperWidth +
    "</td>" +
    "<td>" +
    design.gripper +
    "</td><td>" +
    design.gripper +
    "</td>";

  paper = paper + "</tbody></table></div>";
  let part2 =
    "<div class='row '><div class='col-sm-offset-2'>" +
    side +
    paper +
    "</div></div>";
  let sign =
    "<div class='row ' style='margin-top:3%'><div class='col-sm-offset-2'>" +
    "<div class='col-sm-3'>Designer</div>" +
    "<div class='col-sm-3'>Production Manager</div>" +
    "<div class='col-sm-3'>Executive Director</div></div></div>";
  let page = top + part1 + part2 + sign;
  return new Handlebars.SafeString(page);
});
module.exports = router;
