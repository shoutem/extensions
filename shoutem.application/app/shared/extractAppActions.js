export function extractAppActions(app, appActionsRef) {
  const extensions = app.getExtensions();
  const store = app.getStore();
  Object.keys(extensions).forEach(extensionName => {
    const extension = extensions[extensionName];
    if (extension.actions) {
      Object.keys(extension.actions).forEach(actionName => {
        const action = extension.actions[actionName];
        const resolvedAction = shortcut => store.dispatch(action(shortcut));
        const key = `${extensionName}.${actionName}`;
        // Mutating appActions from application/index.js
        // eslint-disable-next-line no-param-reassign
        appActionsRef[key] = resolvedAction;
      });
    }
  });
}
