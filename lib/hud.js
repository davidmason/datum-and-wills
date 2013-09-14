var hud = {
  instructionOverlay: document.querySelector('#instruction'),
  errorOverlay: document.querySelector('#error'),
  tutorial: document.querySelector('.accordion'),
  walkTutorial: document.getElementsByClassName('accordion-item')[0],
  jumpTutorial: document.getElementsByClassName('accordion-item')[1],
  walkError: document.getElementById('walk-error'),
  jumpError: document.getElementById('jump-error'),
  walkCircuit: document.getElementById('walk-circuit'),
  jumpCircuit: document.querySelector('#jump-circuit'),

  showInstruction: (function (message) {
    var overlay = hud.instructionOverlay;
    overlay.classList.remove('hidden');
    overlay.innerText = message;
    if (hud.clearInstructionsTimeout) {
      hud.clearInstructionsTimeout = null;
    }
    hud.clearInstructionsTimeout = setTimeout(hud.clearInstructions, 4000);
  }),

  clearInstructions: (function () {
    hud.clearInstructionsTimeout = null;
    hud.instructionOverlay.classList.add('hidden');
  }),

  showError: (function (message) {
    var errorOverlay = hud.errorOverlay;
    errorOverlay.classList.remove('hidden');
    errorOverlay.innerText = message;
    setTimeout(hud.showTutorials, 2200);
    if (hud.clearErrorTimeoutHandle) {
      clearTimeout(hud.clearErrorTimeoutHandle);
    }
    hud.clearErrorTimeoutHandle = setTimeout(hud.clearError, 2000);
  }),

  showTutorials: (function () {
    hud.tutorial.style.display = 'block';
  }),

  showJumpTutorial: (function () {
    hud.jumpTutorial.classList.remove('hidden');
    hud.accordion.collapseAll();
    hud.jumpTutorial.classList.add('active');
  }),

  clearError: (function () {
    hud.clearErrorTimeoutHandle = null;
    hud.errorOverlay.classList.add('hidden');
  })

};

(function decorateCircuits () {
  var i, status, circuit, circuits;
  circuits = document.getElementsByClassName('circuit');
  for (i = 0; i < circuits.length; i++) {
    circuit = circuits[i];
    status = circuit.insertBefore(document.createElement('div'), circuit.firstChild);
    status.className = 'status';
    status = circuit.appendChild(document.createElement('div'));
    status.className = 'status';
  }
})();

(function bindAccordionItems () {
  var i, item, toggleAccordionItem;

  hud.accordion = document.querySelector('.accordion');
  hud.accordionItems = hud.accordion.querySelectorAll('.accordion-item');
  hud.accordion.collapseAll = function () {
    var i, items = this.querySelectorAll('.accordion-item');
    for (i = 0; i < items.length; i++) {
      items[i].classList.remove('active');
    }
  };

  toggleAccordionItem = function () {
    var parent = this.parentElement;
    if (parent.classList.contains('active')) {
      parent.classList.remove('active');
    } else {
      hud.accordion.collapseAll();
      parent.classList.add('active');
    }
  };

  for (i = 0; i < hud.accordionItems.length; i++) {
    item = hud.accordionItems[i];
    item.querySelector('.accordion-title').onclick = toggleAccordionItem;
  }
})();

module.exports = hud;