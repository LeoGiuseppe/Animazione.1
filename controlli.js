// ======================= CONTROLLI =======================
// Gestisce input da tastiera (WASD / frecce) e pulsanti speciali.

var keysPressed     = {};
var jumpRequested   = false;
var attackRequested = false;
var slideRequested  = false;
var morphRequested  = false;
var skillRequested  = false;

function initControls() {

  // Resetta tutto se la finestra perde il focus
  window.addEventListener('blur', function () {
    keysPressed     = {};
    jumpRequested   = false;
    attackRequested = false;
    morphRequested  = false;
    skillRequested   = false;
  });

  // ---- Tastiera: pressione ----
  document.addEventListener('keydown', function (e) {
    var k = e.key.toLowerCase();
    // Blocca scroll della pagina sui tasti di gioco
    if (['w', 'arrowup', ' ', 'a', 'arrowleft', 'd', 'arrowright', 'l', 'k', 'r', 'f'].includes(k))
      e.preventDefault();

    keysPressed[k] = true;

    if (k === 'w' || k === 'arrowup' || k === ' ') jumpRequested    = true;
    if (k === 'l')                                 slideRequested   = true;
    if (k === 'k')                                 attackRequested  = true;
    if (k === 'r')                                 morphRequested   = true;
    if (k === 'f')                                 skillRequested   = true;
  });

  // ---- Tastiera: rilascio ----
  document.addEventListener('keyup', function (e) {
    keysPressed[e.key.toLowerCase()] = false;
  });
}
