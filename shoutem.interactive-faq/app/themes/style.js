export default () => ({
  'shoutem.interactive-faq.Question': {
    container: {
      height: 35,
      marginRight: 10,
      borderWidth: 1,
      borderColor: '#000000',
      justifyContent: 'center',
      alignContent: 'center',
      backgroundColor: 'transparent',
      borderRadius: 100,
    },

    backContainer: {
      backgroundColor: '#00AADF',
      borderColor: '#00AADF',
    },

    text: {
      paddingHorizontal: 10,
      fontSize: 13,
      lineHeight: 16,
      color: '#000000',
    },

    backText: {
      color: '#FFFFFF',
    },
  },

  'shoutem.interactive-faq.QuestionsBar': {
    container: {
      flexGrow: 0,
    },
    contentContainer: {
      height: 65,
      padding: 15,
      justifyContent: 'center',
      alignContent: 'center',
    },
  },

  'shoutem.interactive-faq.InteractiveFaqScreen': {
    paddingTop: 30,
    paddingHorizontal: 25,
  },

  'shoutem.interactive-faq.MessageBubble': {
    container: {
      padding: 15,
      marginBottom: 25,
      borderTopLeftRadius: 15,
      borderTopEndRadius: 0,
      borderBottomLeftRadius: 15,
      borderBottomEndRadius: 15,
      backgroundColor: 'rgba(28,171,221, 0.1)',
      alignSelf: 'flex-end',
    },
    botContainer: {
      borderTopLeftRadius: 0,
      borderTopEndRadius: 15,
      backgroundColor: '#F9F9F9',
      alignSelf: 'flex-start',
    },
    text: {
      fontSize: 13,
      lineHeight: 18,
      color: '#000000',
    },
    botText: {
      color: '#333333',
    },
  },
});
