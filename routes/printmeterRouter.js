const express = require("express");
const router = express.Router();
const Handlebars = require("handlebars");
const fs = require('fs');
const pdf = require('html-pdf');
const conversion = require("phantom-html-to-pdf")()
const Design = require("../model/DesignInput");

router.get("/", (req, res) => {
    res.render("desigUi");
});

router.post("/design/insert", (req, res) => {
    console.log(req.body);
    Design.insertdesign(req.body, (status, err, design) => {
        if (status === 200) {
            res.redirect('/design/all');
        }
    });
    //res.redirect('/design/all');
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

router.get('/design/print', function (req, res) {

    res.render('print_pdf');
});
Handlebars.registerHelper("designpage", function (design) {

    let part1 = "<div class='row '><div class='col-sm-offset-2'>";
    let top =
        "<div class='row ' style='margin-bottom:3%'><div class='col-sm-offset-2'>" +
        "<div class='col-sm-4' style='font-size:20px'> Date : " +
        new Date().toDateString() +
        "</div>" +
        "<div class='col-sm-2' style='font-size:20px'>Machine Number : 5</div>" +
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
        "<div class='col-sm-2'>Designer</div>" +
        "<div class='col-sm-2'>Production Manager</div>" +
        "<div class='col-sm-2'>Executive Director</div>" +
        // "<div class='col-sm-3'><form  action='/design/print/' method='get'><button type='submit'><span class='glyphicon glyphicon-list'></span></button></form></div>" +
        "<div class='col-sm-3'><button type='submit' onClick='window.print()'><span class='glyphicon glyphicon-list'></span></button></div>" +
        "</div></div>";
    let page = top + part1 + part2 + sign;
    var html = "";
    var myCSS = "<html>\n" +
        "  <head>\n" +
        "      <link rel=\"stylesheet\" href=\"stylesheets/bootstrap.min.css\">\n" +
        "       <link rel=\"stylesheet\" href=\"stylesheets/style.css\"> " +
        "  </head>\n" +
        "  <body>";
    var pageToprint = myCSS + page + "</body></html>";
    // var options = {
    //     format: 'Letter',
    //     base: 'File:///E:/workstation/Print-Meter/public/pdf',
    //     width: '865px',
    //     height: '1222px',
    //     zoomFactor: .5

    // };
    var options = { format: 'Letter' };
    //var options = { format: 'Letter' }; 

    fs.writeFile('./design.html', pageToprint, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
        var html = fs.readFileSync('./design.html', 'utf8');
        conversion({ html: pageToprint }, function (err, pdf) {
            var output = fs.createWriteStream('./design.pdf')
            console.log(pdf.logs);
            console.log(pdf.numberOfPages);
            // since pdf.stream is a node.js stream you can use it
            // to save the pdf to a file (like in this example) or to
            // respond an http request.
            pdf.stream.pipe(output);
        });
        // pdf.create(pageToprint, options).toFile('./public/pdf/design.pdf', function (err, res) {
        //     if (err) {
        //         console.log(err, "here");
        //         //res.status(500).send("Some kind of error..."); 
        //         return;
        //     }
        //     console.log('pdf created on printMessage');
        // });
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
        jobpage = jobpage + "<tr><td>" + designs[i].invoiceNumber + "</td>" +
            "<td>" + designs[i].itemNumber + "</td>" +
            "<td>" + designs[i].plateNumber + "</td>" +
            "<td>" + new Date(designs[i].deadline).toDateString() + "</td>" +
            "<td>" + new Date(designs[i].deadline).toTimeString() + "</td>" +
            "<td>" + designs[i].side + "</td>" +
            "<td>" + designs[i].sheet + "</td>" +
            "<td>" + designs[i].impressions + "</td>" +
            "<td>" + designs[i].paperLength + "</td>" +
            "<td>" + designs[i].paperWidth + "</td>" +
            "<td>" + designs[i].gripper + "</td>" +

            "<td><form  action='/design/" + designs[i]._id + "' method='get'><button type='submit'><span class='glyphicon glyphicon-list'></span></button></form>" + "</td></tr>";
    }
    jobpage = jobpage + "</tbody></table></div></div>";

    return new Handlebars.SafeString(jobpage);
});
module.exports = router;
