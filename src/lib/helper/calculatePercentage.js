export const calculatePercentage = (lastYear, twoYear) => {
    const lastYearValue = parseInt(lastYear);
    let twoYearValue = parseInt(twoYear);
    if (twoYearValue == 0) {
        twoYearValue = 1;
    }

    if (isNaN(lastYearValue) || isNaN(twoYearValue)) {
        return "N/A";
    }

    const percentage = ((lastYearValue - twoYearValue) / Math.abs(twoYearValue)) * 100;

    return `${parseInt(percentage)}%`;
};