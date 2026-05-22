var keysPressed = {};
var jumpRequested = false;
var attackRequested = false;

function initControls() {
  window.addEventListener('blur', function() {
    keysPressed = {};
    jumpRequested = false;
    attackRequested = false;
  });

  document.addEventListener('keydown', function(e) {
    var key = e.key.toLowerCase();
    if (['w','arrowup',' ','a','arrowleft','d','arrowright','e'].includes(key)) {
      e.preventDefault();
    }
    keysPressed[key] = true;

    switch(key) {
      case 'w':
      case 'arrowup':
      case ' ':
        jumpRequested = true;
        break;
      case 'e':
        attackRequested = true;
        break;
    }
  });

  document.addEventListener('keyup', function(e) {
    var key = e.key.toLowerCase();
    keysPressed[key] = false;
  });
}
