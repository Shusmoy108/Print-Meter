var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

// define the schema for our user model
var designSchema = mongoose.Schema({
  invoiceNumber: Number,
  itemNumber: Number,
  plateNumber: Number,
  paperLength: Number,
  paperWidth: Number,
  gripper: String,
  sheet: Number,
  side: String,
  impressions: Number,
  deadline: Date
});

designSchema.statics.insertdesign = (data, cb) => {
  const newDesign = new Design({
    invoiceNumber: data.invoiceNumber,
    itemNumber: data.itemNumber,
    plateNumber: data.plateNumber,
    paperLength: data.paperLength,
    paperWidth: data.paperWidth,
    gripper: data.gripper,
    sheet: data.sheet,
    side: data.side,
    impressions: data.impressions,
    deadline: data.deadline
  });
  newDesign
    .save()
    .then(design => {
      return cb(200, null, design);
    })
    .catch(err => {
      return cb(500, { msg: "Internal server Error" }, null);
      console.log(err);
    });
};

// methods ======================
// generating a hash

// create the model for users and expose it to our app
module.exports = Design = mongoose.model("Design", designSchema);
