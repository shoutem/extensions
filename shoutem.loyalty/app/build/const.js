const deeplinkQueries = {
  android: {
    manifest: {
      queries: {
        tel: `<intent>
        <action android:name="android.intent.action.VIEW" />
        <data android:scheme="tel" />
        <category android:name="android.intent.category.DEFAULT" />
    </intent>`,
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
