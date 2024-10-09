import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
      mainContainer: {
        backgroundColor: 'black',
        width: '100%',
        height: '100%'
      },
      container: {
        width: '100%',
        height: '100%'
      },
      textContainer: {
        width: '100%',
        paddingTop: 80,
      },
      headingLarge: {
        fontSize: 40,
        lineHeight: 48,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Inter',
      },
      heading: {
        color: 'white',
        textAlign: 'center',
        fontSize: 32,
        fontFamily: 'Inter',
        lineHeight: 40,
      },
      subtitle: {
        textAlign: 'center',
        paddingTop: 20,
        color: 'white',
        fontSize: 18,
        lineHeight: 24,
        width: '60%',
        marginLeft: '20%',
        marginRight: '20%'
      },
      multipassImg: {
        width: '80%',
        height: '38%',
        resizeMode: 'contain',
        marginLeft: '10%',
        marginRight: '10%',
        marginTop: 80
      },
      footer: {
        width: '100%',
        position: 'absolute',
        bottom: 60,
        justifyContent: 'center'
      },
      sublinkContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 20
      },
      sublinkText: {
        color: 'white',
        fontSize: 12,
        fontFamily: 'Inter'
      },
      sublinkAction: {
        color: 'white',
        fontSize: 12,
        fontFamily: 'Inter',
        textDecorationLine: 'underline'
      },

      modalContainer: {
        justifyContent: 'flex-end',
        margin: 0,
      },
      modalContent: {
        height: 350,
        paddingBottom: 20,
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        backgroundColor: '#470644'
      },
      modalHeader: {
        paddingTop: '7%',
        fontSize: 20,
        fontFamily: 'Inter'
      },
      modalPrompt: {
        paddingTop: '10%',
        fontSize: 16,
        fontFamily: 'Inter',
        paddingBottom: 30
      },
      modalIconContainer: {
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#F29AE9',
        borderWidth: 3,
        borderRadius: 80,
        marginTop: '7%',
      },
      modalIcon: {
        color: '#F29AE9'
      },
      navContainer: {
        flexDirection: 'row',
        width: '95%',
        marginLeft: '5%',
      },
});

export default Styles