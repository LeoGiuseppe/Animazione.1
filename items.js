// ======================= ITEMS & ABILITÀ =======================

var items = [
  { col: 25,  row: MAP_H - 17, type: 'ability',    abilityName: 'Morph Ball', color: '#f39c12', symbol: '★', collected: false },
  { col: 107, row: MAP_H - 17, type: 'ability',    abilityName: 'High Jump',  color: '#27ae60', symbol: '★', collected: false },
  { col: 5,   row: MAP_H - 9,  type: 'save',       color: '#e67e22', symbol: '💾', collected: false },
  { col: 40,  row: MAP_H - 29, type: 'save',       color: '#e67e22', symbol: '💾', collected: false },
  { col: 79,  row: MAP_H - 29, type: 'save',       color: '#e67e22', symbol: '💾', collected: false },
  { col: 20,  row: MAP_H - 9,  type: 'checkpoint', color: '#3498db', symbol: 'S',  collected: false },
  { col: 47,  row: MAP_H - 9,  type: 'checkpoint', color: '#3498db', symbol: 'S',  collected: false },
  { col: 90,  row: MAP_H - 9,  type: 'checkpoint', color: '#3498db', symbol: 'S',  collected: false },
  { col: 7,   row: MAP_H - 23, type: 'keyitem',    color: '#9b59b6', symbol: '◆',  collected: false },
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
        showBanner('Oggetto chiave raccolto!');
      }
    }
  }
}