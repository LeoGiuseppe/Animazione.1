// ======================= ITEMS & ABILITÀ =======================
// VERSIONE AGGIORNATA: item e checkpoint spostati su piattaforme reali

var items = [
  // ★ Morph Ball — su piattaforma Ancient Ruins (col 23, MAP_H-16 è la piattaforma)
  { col: 25,  row: MAP_H - 17, type: 'ability', abilityName: 'Morph Ball', color: '#f39c12', symbol: '★', collected: false },

  // ★ High Jump — su piattaforma Final Boss Arena (col 105-112, MAP_H-16 è la piattaforma)
  { col: 109, row: MAP_H - 17, type: 'ability', abilityName: 'High Jump',  color: '#27ae60', symbol: '★', collected: false },

  // 💾 Save — START (già ok: col 5, piano MAP_H-8)
  { col: 5,   row: MAP_H - 9,  type: 'save',       color: '#e67e22', symbol: '💾', collected: false },

  // 💾 Save — Starting Castrum (FIX: spostato a col 42, row MAP_H-29 sopra il piano MAP_H-28)
  { col: 42,  row: MAP_H - 29, type: 'save',       color: '#e67e22', symbol: '💾', collected: false },

  // 💾 Save — B2 Corridor (FIX: spostato a col 62 sopra piano MAP_H-28, era col 79 fuori zona)
  { col: 62,  row: MAP_H - 29, type: 'save',       color: '#e67e22', symbol: '💾', collected: false },

  // 💾 Save — Final Boss Arena (NUOVO: prima non c'era nessun save nell'arena finale)
  { col: 120, row: MAP_H - 9,  type: 'save',       color: '#e67e22', symbol: '💾', collected: false },

  // S Checkpoint — Ancient Ruins (FIX: su piattaforma, era col 20 sul pavimento)
  { col: 20,  row: MAP_H - 9,  type: 'checkpoint', color: '#3498db', symbol: 'S',  collected: false },

  // S Checkpoint — Hub (piano basso, col 47 ok)
  { col: 47,  row: MAP_H - 9,  type: 'checkpoint', color: '#3498db', symbol: 'S',  collected: false },

  // S Checkpoint — Research Lab basso (FIX: spostato a col 70 sul piano MAP_H-8)
  { col: 70,  row: MAP_H - 9,  type: 'checkpoint', color: '#3498db', symbol: 'S',  collected: false },

  // S Checkpoint — Miniboss Arena (FIX: col 88 sul piano MAP_H-8, prima del boss)
  { col: 88,  row: MAP_H - 9,  type: 'checkpoint', color: '#3498db', symbol: 'S',  collected: false },

  // ◆ Key item — Submerged Caves (FIX: spostato sulla piattaforma apicale col 9, MAP_H-33→MAP_H-34)
  { col: 10,  row: MAP_H - 34, type: 'keyitem',    color: '#9b59b6', symbol: '◆',  collected: false },
];

var playerAbilities = {
  morphBall: false,
  highJump:  false
};

function checkItemCollection(player) {
  var pc = Math.floor((player.x + player.width / 2) / tileSize);
  var pr = Math.floor((player.y + player.height / 2) / tileSize);

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.collected) continue;
    if (Math.abs(item.col - pc) <= 1 && Math.abs(item.row - pr) <= 1) {
      item.collected = true;

      if (item.type === 'ability') {
        if (item.abilityName === 'Morph Ball') {
          playerAbilities.morphBall = true;
          showBanner('Abilità: Morph Ball sbloccata! Premi [R] per trasformarti.');
        }
        if (item.abilityName === 'High Jump') {
          playerAbilities.highJump  = true;
          showBanner('Abilità: High Jump sbloccata! [Spazio] più alto e premi [F] in aria.');
        }
        updateAbilitiesHUD();

      } else if (item.type === 'save' || item.type === 'checkpoint') {
        lastCheckpoint = { x: player.x, y: player.y };
        showBanner(item.type === 'save' ? 'Partita Salvata!' : 'Checkpoint raggiunto');

      } else if (item.type === 'keyitem') {
            // Applica potenziamento temporaneo: aumenta il danno del giocatore del 50% fino al reset
            if (typeof animatedObject !== 'undefined') {
              animatedObject.damageMultiplier = 1.5;
            }
            showBanner('Oggetto chiave raccolto! Danno aumentato del 50% fino al reset.');
      }
    }
  }
}
