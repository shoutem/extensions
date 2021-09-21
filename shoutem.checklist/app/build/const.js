const deeplinkQueries = {
  android: {
    manifest: {
      queries: {
        mailto: `<intent>
        <action android:name="android.intent.action.SENDTO" />
        <data android:scheme="mailto" />
        <category android:name="android.intent.category.DEFAULT" />
    </intent>`,
      },
    },
  },
};

module.exports = {
  deeplinkQueries,
};
