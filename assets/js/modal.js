/*
* https://flowbite.com/docs/components/modal/#javascript-behaviour
* */
const $targetEl = document.getElementById('messageModal');

// options with default values
const options = {
  placement: 'centre',
  backdrop: 'static',
  backdropClasses:
        'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
  closable: true,
  onHide: () => {
    console.log('modal is hidden');
  },
  onShow: () => {
    console.log('modal is shown');
  },
  onToggle: () => {
    console.log('modal has been toggled');
  },
};

// instance options object
const instanceOptions = {
  id: 'messageModal',
  override: true,
};

/*
 * $targetEl: required
 * options: optional
 */
const messageModal = new Modal($targetEl, options, instanceOptions);
