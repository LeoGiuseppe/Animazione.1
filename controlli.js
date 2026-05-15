function initControls() {
  document.addEventListener('keydown', function(e) {
    var key = e.key.toLowerCase();
    switch(key) {
      case 'w':
      case 'arrowup':
      case ' ':
        jump();
        e.preventDefault();
        break;
      case 'a':
      case 'arrowleft':
        moveleft();
        e.preventDefault();
        break;
      case 'd':
      case 'arrowright':
        moveright();
        e.preventDefault();
        break;
    }
  });

  document.addEventListener('keyup', function(e) {
    var key = e.key.toLowerCase();
    if (['a', 'd', 'arrowleft', 'arrowright'].includes(key)) {
      clearmove();
    }
  });
}
