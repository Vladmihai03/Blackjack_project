function showSplitElement() {
  document.getElementById('split').style.display = 'block';
}

// Definirea unei funcții pentru a ascunde elementul cu id-ul 'split'
function hideSplitElement() {
  document.getElementById('split').style.display = 'none';
}

export {
  showSplitElement,
  hideSplitElement
}