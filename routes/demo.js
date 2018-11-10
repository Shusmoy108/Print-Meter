var pageToprint = myCSS + printpage1;
console.log(printpage1);

var options = {
  format: "Letter",
  base: "File:///home/badmin/Downloads/Biggo/public/",
  width: "865px",
  height: "1222px",
  zoomFactor: 0.5
};

//var options = { format: 'Letter' };

fs.writeFile("./message.html", pageToprint, err => {
  if (err) throw err;
  console.log("The file has been saved!");
  html = fs.readFileSync("./message.html", "utf8");
  pdf
    .create(pageToprint, options)
    .toFile("./public/pdf/print1.pdf", function(err, res) {
      if (err) {
        console.log(err);
        //res.status(500).send("Some kind of error...");
        return;
      }
      console.log("pdf created on printMessage");
    });
});
