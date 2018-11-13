const checker = require("./is-empty");

module.exports.designInput = data => {

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
    if (!checker.isNumber(data.paperLength)) {
        errors.paperLength = "Paper Length field is required";
    }
    if (!checker.isNumber(data.paperWidth)) {
        errors.paperWidth = "Paper Width field is required";
    }
    if (!checker.isStringAndNotEmpty(data.gripper)) {
        errors.gripper = "Gripper field is required";
    }
    if (!checker.isNumber(data.sheet)) {
        errors.sheet = "Sheet field is required";
    }
    if (!checker.isNumber(data.side)) {
        errors.side = "Side field is required";
    }
    if (!checker.isNumber(data.impressions)) {
        errors.impressions = "Impressions field is required";
    }
    if (!checker.isDate(data.deadline)) {
        errors.deadline = "Deadline field is required";
    }
    return {
        errors,
        isValid: checker.isEmpty(errors)
    };
};