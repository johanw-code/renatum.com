document.addEventListener('DOMContentLoaded', function() {
  var dropdown = document.querySelector('.nav-dropdown');
  var trigger = dropdown && dropdown.querySelector(':scope > a');
  if (!trigger) return;
  trigger.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });
  document.addEventListener('click', function(e) {
    if (dropdown && !dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });
});
