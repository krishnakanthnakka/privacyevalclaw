'use strict';
document.addEventListener('click', event => {
  const action = event.target.closest('[data-trace-action]');
  if (action) {
    const card = action.closest('.raw-trajectory');
    const expand = action.dataset.traceAction === 'expand';
    card.querySelectorAll('.trace-step').forEach(step => { step.open = expand; });
  }
  const jump = event.target.closest('[data-open-step]');
  if (jump) {
    const step = document.getElementById(jump.dataset.openStep);
    if (step) step.open = true;
  }
});
