
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import AppLogo from "../../assets/app.png";


const Splash = () => {
    const navigation = useNavigation();
    const handleGoButtonPress = () => {
        // Navigate to the Home screen when the "Go!" button is pressed.
        navigation.navigate('Classes'); // Adjust the screen name if needed.
      };
    
      return (
        <View style={styles.container}>
          <Image source={AppLogo} style={styles.logo} />
          <TouchableOpacity onPress={handleGoButtonPress} style={styles.button}>
            <Text style={styles.buttonText}>Go!</Text>
          </TouchableOpacity>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      logo: {
        width: 200, // Adjust the width and height according to your logo's dimensions.
        height: 200,
        resizeMode: 'contain',
      },
      button: {
        marginTop: 20,
        backgroundColor: '#007AFF', // Adjust the button's appearance as needed.
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
      },
      buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
    });
    
    export default Splash;
