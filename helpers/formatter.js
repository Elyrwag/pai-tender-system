// function which makes spaces after every 3 digits in a number
// i.e.: 12 000 000,00
exports.numberWithSpaces = (num) => {
    return new Intl.NumberFormat('pl-PL', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
};