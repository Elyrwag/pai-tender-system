const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const endDateError = document.getElementById('endDateError');

const errorMsg = 'Data zakończenia musi być późniejsza niż data rozpoczęcia!';

function onChangeFunc() {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    if (endDate <= startDate) {
        endDateInput.setCustomValidity(errorMsg);
        endDateError.innerHTML = errorMsg;
        endDateError.style.display = 'block';
    } else {
        endDateInput.setCustomValidity('');
        endDateError.style.display = 'none';
    }
}

endDateInput.addEventListener('change', onChangeFunc);
startDateInput.addEventListener('change', onChangeFunc);
