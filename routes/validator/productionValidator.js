const checker = require("./is-empty");

module.exports.productionInput = data => {

    let errors = {};
    if (!checker.isStringAndNotEmpty(data.machineId)) {
        errors.machineId = "Machine ID field is required";
    }
    if (!checker.isNumber(data.invoiceNumber)) {
        errors.invoiceNumber = "Invoice Number field is required";
    }
    if (!checker.isNumber(data.itemNumber)) {
        errors.itemNumber = "Item Number field is required";
    }
    if (!checker.isNumber(data.plateNumber)) {
        errors.plateNumber = "Plate Number field is required";
    }
    if (!checker.isNumber(data.impressionReading)) {
        errors.impressionReading = "Impression Reading field is required";
    }
    if (!checker.isNumber(data.impressionCount)) {
        errors.impressionCount = "Impression Reading field is required";
    }
    if (!checker.isDate(data.starttime)) {
        errors.starttime = "Start time field is required";
    }
    if (!checker.isDate(data.finishtime)) {
        errors.finishtime = "Finish time field is required";
    }
    return {
        errors,
        isValid: checker.isEmpty(errors)
    };
};