export default function getRootScreen(state) {
  const {
    configuration: { value: configurationId },
    configurations,
    shortcuts,
  } = state['shoutem.application'];

  const configuration = configurations[configurationId];
  const rootShortcutId = configuration.relationships.navigation.data[0].id;

  return shortcuts[rootShortcutId].attributes.screens[0];
}
