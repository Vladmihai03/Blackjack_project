// Funcție pentru afișarea notificării de asigurare
function showInsuranceNotification() {
  document.getElementById('insurance-notification').style.display = 'block';
}

// Funcție pentru ascunderea notificării de asigurare
function hideInsuranceNotification() {
  document.getElementById('insurance-notification').style.display = 'none';
}

// Funcție pentru afișarea notificării de răspuns
function showResponseNotification() {
  document.getElementById('no-blackjack-notification').style.display = 'block';
}

// Funcție pentru ascunderea notificării de răspuns
function hideResponseNotification() {
  document.getElementById('no-blackjack-notification').style.display = 'none';
}

// Exportul funcțiilor pentru manipularea notificărilor
export {
  showInsuranceNotification,
  hideInsuranceNotification,
  showResponseNotification,
  hideResponseNotification
}
