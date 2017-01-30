// listen for sandbox initialization complete
document.addEventListener('sandboxready', onSandboxReady, false);

// handler for sandbox initialization finished
function onSandboxReady(event) {
  // config object containing buidler extension configuration, can be accessed via event
  // or by shoutem.sandbox.config
  const config = event.detail;

  // Waiting for DOM to be ready to initialize shoutem.api and call app start function
  $(document).ready(function() {
    shoutem.api.init(config);
    appReady(config);
  });
};

// Put your settings page logic here, executes when sandbox and DOm are initalized
function appReady(config) {

  function handleSubmit(e) {
    // prevent default action and bubbling
    e.preventDefault();
    e.stopPropagation();

    const greeting = $('#greeting').val();

    // updates current shortcut settings by patching with current settings
    shoutem.api.updateShortcutSettings({ greeting });
  }

  function initForm(settings) {
    $('#greeting').val(settings.greeting);
  }

  $('button[type="submit"]').click(handleSubmit);

  // shoutem.api knows current shortcut and returns promise with fetched settings
  shoutem.api.getShortcutSettings().then(initForm);
}
