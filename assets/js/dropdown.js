// set the dropdown menu element
const userSettingsMenuTargetEl = document.getElementById('user-dropdown');

// set the element that trigger the dropdown menu on click
const userSettingsMenuTriggerEl = document.getElementById('user-menu-button');

// options with default values
const userSettingsMenuOptions = {
  placement: 'bottom',
  triggerType: 'click',
  offsetSkidding: 0,
  offsetDistance: 10,
  delay: 300,
  ignoreClickOutsideClass: false,
  onHide: () => {},
  onShow: () => {},
  onToggle: () => {},
};

// instance options object
const userSettingsMenuInstanceOptions = {
  id: 'user-dropdown',
  override: true,
};

const userSettingsMenuDropdown = new Dropdown(
  userSettingsMenuTargetEl,
  userSettingsMenuTriggerEl,
  userSettingsMenuOptions,
  userSettingsMenuInstanceOptions,
);
