
// ======================= CONTROLLI =======================
// Gestisce input da tastiera (WASD / frecce) e touch mobile.
// Le variabili keysPressed, jumpRequested, attackRequested
// vengono lette da player.js ogni frame.

var keysPressed    = {};
var jumpRequested  = false;
var attackRequested = false;

function initControls() {

  // Resetta tutto se la finestra perde il focus
  window.addEventListener('blur', function () {
    keysPressed     = {};
    jumpRequested   = false;
    attackRequested = false;
  });

  // ---- Tastiera: pressione ----
  document.addEventListener('keydown', function (e) {
    var k = e.key.toLowerCase();
    // Blocca scroll della pagina sui tasti di gioco
    if (['w', 'arrowup', ' ', 'a', 'arrowleft', 'd', 'arrowright', 'e'].includes(k))
      e.preventDefault();

    keysPressed[k] = true;

    if (k === 'w' || k === 'arrowup' || k === ' ') jumpRequested   = true;
    if (k === 'e')                                   attackRequested = true;
  });

  // ---- Tastiera: rilascio ----
  document.addEventListener('keyup', function (e) {
    keysPressed[e.key.toLowerCase()] = false;
  });
}
