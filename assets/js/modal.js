/*
* https://flowbite.com/docs/components/modal/#javascript-behaviour
* */
const $modalTargetEl = document.getElementById('messageModal');

// options with default values
const modalOptions = {
  placement: 'centre',
  backdrop: 'static',
  backdropClasses:
        'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
  closable: true,
  onHide: () => {},
  onShow: () => {},
  onToggle: () => {},
};

// instance options object
const modalInstanceOptions = {
  id: 'messageModal',
  override: true,
};

/*
 * $targetEl: required
 * options: optional
 */
const messageModal = new Modal($modalTargetEl, modalOptions, modalInstanceOptions);
