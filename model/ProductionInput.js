var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
const ObjectId = mongoose.Types.ObjectId;
// define the schema for our user model
var productionSchema = mongoose.Schema({
    machineId: String,
    invoiceNumber: Number,
    itemNumber: Number,
    plateNumber: Number,
    impressionReading: Number,
    impressionCount: Number,
    starttime: Date,
    finishtime: Date
});

productionSchema.statics.insertProduction = (data, cb) => {
    const newProduction = new Production({
        machineId: data.machineId,
        invoiceNumber: data.invoiceNumber,
        itemNumber: data.itemNumber,
        plateNumber: data.plateNumber,
        impressionReading: data.impressionReading,
        impressionCount: data.impressionCount,
        starttime: data.starttime,
        finishtime: data.finishtime,
    });

    newProduction
        .save()
        .then(production => {
            console.log(production)
            return cb(200, null, production);
        })
        .catch(err => {
            console.log(err);
            return cb(500, { msg: "Internal server Error" }, null);

        });
};
productionSchema.statics.getProductionById = function (id, cb) {
    this.findOne({ _id: new ObjectId(id) }, (err, production) => {
        console.log(err, production)
        if (!err) {
            cb(200, null, production)
        }
        else {
            cb(500, { msg: "database error" }, null);
        }
    })
}
productionSchema.statics.getProduction = function (cb) {
    this.find({}, (err, productions) => {
        if (!err) {
            cb(200, null, productions)
        }
        else {
            cb(500, { msg: "database error" }, null);
        }
    })
}
// methods ======================
// generating a hash

// create the model for users and expose it to our app
module.exports = Production = mongoose.model("Production", productionSchema);
