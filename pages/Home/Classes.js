import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Classes = () => {
  const navigation = useNavigation();

  const handleClassSelection = (selectedClass) => {
    // Navigate back to the Home screen with the selected class
    navigation.navigate('Home', { selectedClass });
  };

  return (
    <View style={styles.container}>
      <Text>Select a Class:</Text>
      {[...Array(15)].map((_, index) => (
        <Button
          key={index}
          title={`Class ${index + 1}`}
          onPress={() => handleClassSelection(index + 1)}
        />
      ))}
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
});

export default Classes;
