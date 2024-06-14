export const calculateTaxAmount = (subtotal, taxPercentage) => {
    // Convert tax percentage to decimal
    var taxDecimal = taxPercentage / 100;
    // Calculate the tax amount
    var taxAmount = (subtotal * taxDecimal).toFixed(2);
    return taxAmount;
}