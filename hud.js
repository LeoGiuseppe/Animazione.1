
// ======================= HUD & BANNER =======================
// Gestisce: cuori, abilità sbloccate, nome zona, banner popup.

var lastZoneName = '';
var bannerTimer  = null;

// Aggiorna i cuori nell'HUD HTML
function updateHeartsHUD() {
  var el = document.getElementById('hearts-hud');
  el.innerHTML = '<span class="label">HP&nbsp;</span>';
  for (var i = 0; i < animatedObject.lives; i++) {
    var h = document.createElement('span');
    h.className   = 'heart';
    h.textContent = '♥';
    el.appendChild(h);
  }
}

// Aggiorna i badge abilità nell'HUD HTML
function updateAbilitiesHUD() {
  var el = document.getElementById('abilities-hud');
  el.innerHTML = '';
  [
    ['morphBall', 'Morph Ball'],
    ['highJump',  'High Jump']
  ].forEach(function (ab) {
    var badge = document.createElement('span');
    badge.className   = 'ability-badge' + (playerAbilities[ab[0]] ? '' : ' inactive');
    badge.textContent = ab[1];
    el.appendChild(badge);
  });
}

// Mostra il nome della zona corrente nell'HUD e nel banner
function detectZone(col, row) {
  for (var i = 0; i < zones.length; i++) {
    var z = zones[i];
    if (col >= z.x1 && col < z.x2 && row >= z.y1 && row < z.y2) {
      if (z.name !== lastZoneName) {
        lastZoneName = z.name;
        document.getElementById('zone-name').textContent = '📍 ' + z.name;
        showBanner(z.name);
      }
      return;
    }
  }
}

// Mostra un banner temporaneo in cima allo schermo
function showBanner(text) {
  var el = document.getElementById('zone-banner');
  el.textContent  = text;
  el.style.opacity = '1';
  if (bannerTimer) clearTimeout(bannerTimer);
  bannerTimer = setTimeout(function () { el.style.opacity = '0'; }, 2000);
}

