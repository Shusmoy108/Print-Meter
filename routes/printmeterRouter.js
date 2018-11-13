const express = require("express");
const router = express.Router();
const Handlebars = require("handlebars");
const fs = require("fs");
const pdf = require("html-pdf");
//const phantomPath = require("witch")("phantomjs-prebuilt", "phantomjs");
const Design = require("../model/DesignInput");
const Production = require("../model/ProductionInput");
const validator = require('./validator/designValidator');
const productionValidator = require('./validator/productionValidator')
router.get("/design/input", (req, res) => {
    res.render("desigUi", { errors: {} });
});

router.get("/production/input", (req, res) => {
    res.render("productionUi", { errors: {} });
});

router.post("/production/insert", (req, res) => {
    console.log(req.body);
    const valid = productionValidator.productionInput(req.body);
    if (!valid.isValid) {
        console.log(valid.errors)
        res.render("productionUi", { errors: valid.errors });
    }
    else {
        Production.insertProduction(req.body, (status, err, production) => {
            if (status === 200) {
                res.redirect("/production/all");
            }
        });
    }
});
router.post("/design/insert", (req, res) => {
    console.log(req.body);
    const valid = validator.designInput(req.body);
    if (!valid.isValid) {
        console.log(valid.errors)
        res.render("desigUi", { errors: valid.errors });
    }
    else {
        Design.insertdesign(req.body, (status, err, design) => {
            if (status === 200) {
                res.redirect("/design/all");
            }
        });
    }
});
router.get("/production/all", (req, res) => {
    Production.getProduction((status, err, designs) => {
        if (status === 200) {
            //console.log(designs);
            res.render("printpage", { designs: designs, page: true });
        }
    });
});

router.get("/design/all", (req, res) => {
    Design.getDesign((status, err, designs) => {
        if (status === 200) {
            //console.log(designs);
            res.render("printpage", { designs: designs, page: true });
        }
    });
});

router.get("/design/:id", (req, res) => {
    console.log("here");
    Design.getDesignById(req.params.id, (status, err, design) => {
        if (status === 200) {
            console.log(design);
            res.render("printpage", { design: design, page: false });
        }
    });
});

router.get("/designs/print", function (req, res) {
    res.render("print_pdf");
    let html = fs.readFileSync("design.html", "utf8");
    console.log(html);
});
Handlebars.registerHelper("designpage", function (design) {
    let part1 = "<div class='row'><div class='col-xs-offset-1'>";
    let top =
        "<div class='row' style='margin-bottom:3%'><div class='col-xs-offset-2'>" +
        "<div class='col-xs-5' style='font-size:20px'> Date : " +
        new Date().toDateString() +
        "</div>" +
        "<div class='col-xs-5' style='font-size:20px'>Machine Number : " + design.machineId + "</div>" +
        "</div></div>";
    var jobid = "";
    jobid =
        jobid +
        "<div class='col-xs-4 col-xs-offset-1'><table class=\"table table-bordered \" id='result'>\n" +
        "    <thead><tr>\n" +
        "        <th colspan='3' style='text-align:center'>Job ID</th>\n" +
        "       </tr>\n" +
        "       <tr>\n" +
        "        <th >Invoice Number</th>\n" +
        "        <th>Item Number</th>\n" +
        "        <th>Plate Number</th></tr></thead>\n" +
        "   <tbody><tr><td>\n" +
        design.invoiceNumber +
        "</td>" +
        "<td>" +
        design.itemNumber +
        "</td>" +
        "<td>" +
        design.plateNumber +
        "</td></tr>";

    jobid = jobid + "</tbody></table></div>";
    var deadline = "";
    deadline =
        deadline +
        "<div class='col-xs-4 col-xs-offset-1'><table class=\"table table-bordered \" id='result'>\n" +
        "    <thead><tr>\n" +
        "        <th colspan='2' style='text-align:center'>Deadline</th>\n" +
        "           </tr>\n" +
        "        <tr>" +
        "        <th >Date</th>\n" +
        "        <th>Time</th>\n" +
        "           </tr>\n" +
        "      <tbody><tr><td>\n" +
        new Date(design.deadline).toDateString() +
        "</td>" +
        "<td>" +
        new Date(design.deadline).toLocaleTimeString() +
        "</td></tr>\n";

    deadline = deadline + "</tbody></table></div>";
    part1 = part1 + jobid + deadline + "</div></div>";
    var side = "";
    side =
        side +
        "<div class='col-xs-4 col-xs-offset-1'><table class=\"table table-bordered \" id='result'>\n" +
        "    <thead><tr>\n" +
        "        <th >Side</th>\n" +
        "        <th >Sheet</th>\n" +
        "        <th>Impression</th>\n" +
        "      </tr></thead><tbody><tr><td>" +
        design.side +
        "</td>" +
        "<td>" +
        design.sheet +
        "</td>" +
        "<td>" +
        design.impressions +
        "</td></tr>";

    side = side + "</tbody></table></div>";
    var paper = "";
    paper =
        paper +
        "<div class='col-xs-4 col-xs-offset-1'><table class=\"table table-bordered \" id='result'>\n" +
        "    <thead><tr>\n" +
        "        <th colspan='2' style='text-align:center'>Paper Size</th>\n<th colspan='2' style='text-align:center'>Gripper</th></tr> \n" +
        "    </thead> <tbody><tr><td>" +
        design.paperLength +
        "</td>" +
        "<td>" +
        design.paperWidth +
        "</td>" +
        "<td>" +
        design.gripper +
        "</td><td>" +
        design.gripper +
        "</td></tr>";

    paper = paper + "</tbody></table></div>";
    let part2 =
        "<div class='row '><div class='col-xs-offset-1'>" +
        side +
        paper +
        "</div></div>";
    let sign =
        "<div class='row' style='margin:8% 0%'><div class='col-xs-offset-2'>\n" +
        "<div class='col-xs-3'>Designer</div>\n" +
        "<div class='col-xs-3'>Production Manager</div>\n" +
        "<div class='col-xs-3'>Executive Director</div>\n" +
        "<div class='col-xs-1'><form  action='/designs/print' method='get'><button type='submit' ' class='btn btn-default'><span class='glyphicon glyphicon-list'></span></button></form></div>\n" +
        "</div></div>";
    let page = top + part1 + part2 + sign;
    var myCSS =
        "<html>\n" +
        "  <head>\n" +
        '      <link rel="stylesheet" href="stylesheets/bootstrap.min.css">\n' +
        '      <link rel="stylesheet" href="stylesheets/style.css">\n' +
        "  </head>\n" +
        "  <body>\n";
    var logo =
        "<div class='container' ><img src='../public/images/biggo.png' class='img-responsive' width='70px' /></div>\n";
    var footer =
        "<footer class='container-fluid text-center'><p>Project Management Software Made By</p>\n" +
        '<div class="row">' +
        '<div class="col-xs-offset-6">' +
        '<img src="../public//images/biggo.png" class="img-responsive" width=100px /></div></div></footer>\n';
    var pageToprint = myCSS + logo + page + "\n" + footer + "</body></html>";
    var options = {
        format: "letter",
        base: "http://localhost:5000/public/",
        // width: "865px",
        // height: "1222px",
        zoomFactor: 0.5
    };
    fs.writeFile("design.html", pageToprint, err => {
        if (err) {
            console.log("error here");
        }
        console.log("The file has been saved!");
        pdf
            .create(pageToprint, options)
            .toFile("./public/pdf/print1.pdf", function (err, res2) {
                if (err) {
                    console.log(err);
                    console.log("error here");
                    //res.status(500).send("Some kind of error...");
                    return;
                }
                console.log("pdf created on printMessage");
                console.log(res2);
                //res.render("print_pdf");
            });
    });
    return new Handlebars.SafeString(page);
});

Handlebars.registerHelper("designtable", function (designs) {
    var jobpage = "";
    jobpage =
        jobpage +
        "<div class='row'><table class=\"table table-bordered \" id='result'>\n" +
        "    <thead><tr>\n" +
        "        <th >Invoice Number</th>\n" +
        "        <th>Item Number</th>\n" +
        "        <th>Plate Number</th>" +
        "        <th >Date</th>\n" +
        "        <th>Time</th>\n" +
        "        <th >Side</th>\n" +
        "        <th >Sheet</th>\n" +
        "        <th>Impression</th>\n" +
        "        <th>Paper Width</th>\n" +
        "        <th>Paper Length</th>\n" +
        "        <th>Gripper</th>\n" +
        "        <th></th>\n" +
        "</tr>\n<tbody>";
    for (let i = 0; i < designs.length; i++) {
        jobpage =
            jobpage +
            "<tr><td>" +
            designs[i].invoiceNumber +
            "</td>" +
            "<td>" +
            designs[i].itemNumber +
            "</td>" +
            "<td>" +
            designs[i].plateNumber +
            "</td>" +
            "<td>" +
            new Date(designs[i].deadline).toDateString() +
            "</td>" +
            "<td>" +
            new Date(designs[i].deadline).toTimeString() +
            "</td>" +
            "<td>" +
            designs[i].side +
            "</td>" +
            "<td>" +
            designs[i].sheet +
            "</td>" +
            "<td>" +
            designs[i].impressions +
            "</td>" +
            "<td>" +
            designs[i].paperLength +
            "</td>" +
            "<td>" +
            designs[i].paperWidth +
            "</td>" +
            "<td>" +
            designs[i].gripper +
            "</td>" +
            "<td><form  action='/design/" +
            designs[i]._id +
            "' method='get'><button type='submit' class='btn btn-default'><span class='glyphicon glyphicon-list'></span></button></form>" +
            "</td></tr>";
    }
    jobpage = jobpage + "</tbody></table></div></div>";

    return new Handlebars.SafeString(jobpage);
});
module.exports = router;
