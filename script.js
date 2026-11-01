'use strict';
const themeButton = document.getElementById('theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
function isDark() {
  return document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === 'dark'
    : systemTheme.matches;
}
function updateThemeLabel() {
  const label = `Switch to ${isDark() ? 'light' : 'dark'} theme`;
  themeButton.setAttribute('aria-label', label);
  themeButton.title = label;
}
themeButton.addEventListener('click', () => {
  const next = isDark() ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('privacyevalclaw-theme', next); } catch {}
  updateThemeLabel();
});
systemTheme.addEventListener('change', updateThemeLabel);
updateThemeLabel();

document.getElementById('copy-bibtex').addEventListener('click', async () => {
  const citation = document.getElementById('bibtex');
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText(citation.textContent);
    status.textContent = 'Citation copied to clipboard.';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(citation);
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = 'Citation selected. Press Ctrl+C (Windows) or ⌘C (Mac) to copy.';
  }
});


// Keep long target-model responses compact while retaining their full text.
const responsePreviews = [...document.querySelectorAll('.original-response, .trace-response')].map((response, index) => {
  response.id ||= `model-response-${index + 1}`;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'response-toggle';
  button.textContent = 'Show full response';
  button.setAttribute('aria-controls', response.id);
  button.setAttribute('aria-expanded', 'false');
  button.hidden = true;
  response.after(button);
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(expanded));
    button.textContent = expanded ? 'Show fewer lines' : 'Show full response';
    response.classList.toggle('response-collapsed', !expanded);
  });
  return {response, button};
});
function updateResponsePreviews() {
  responsePreviews.forEach(({response, button}) => {
    const lineHeight = parseFloat(getComputedStyle(response).lineHeight);
    const limit = lineHeight * 5;
    response.style.setProperty('--response-preview-height', `${limit}px`);
    const long = response.scrollHeight > limit + 2;
    button.hidden = !long;
    response.classList.toggle('response-collapsed', long && button.getAttribute('aria-expanded') !== 'true');
  });
}
updateResponsePreviews();
window.addEventListener('resize', updateResponsePreviews);
document.fonts.ready.then(updateResponsePreviews);
