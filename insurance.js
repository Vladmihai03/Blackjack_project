function showInsuranceNotification() {
  document.getElementById('insurance-notification').style.display = 'block';
}

// Ascunde notificarea pentru asigurare
function hideInsuranceNotification() {
  document.getElementById('insurance-notification').style.display = 'none';
}

function showResponseNotification() {
  document.getElementById('no-blackjack-notification').style.display = 'block';
}

function hideResponseNotification() {
  document.getElementById('no-blackjack-notification').style.display = 'none';
}


export {
  showInsuranceNotification,
  hideInsuranceNotification,
  showResponseNotification,
  hideResponseNotification
}

