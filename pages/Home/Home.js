import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Accelerometer, Magnetometer } from "expo-sensors";
import { useEffect, useState } from "react";

export default function Home() {
  const THRESHOLD = 0.5;
  const FIXED_CORRECTION = 4;

  const [data, setData] = useState({});
  const [currentTilt, setCurrentTilt] = useState(0);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [currentAcc, setCurrentAcc] = useState();
  const [orientation, setOrientation] = useState({
    azimuth: 0,
    direction: "N", // Initialize with North
  });

  useEffect(() => {
    subscribe();
  }, []);

  const subscribe = () => {
    const subscription = Accelerometer.addListener((accelerometerData) => {
      let fixedData = {
        x: (accelerometerData.x * 10).toFixed(FIXED_CORRECTION),
        y: (accelerometerData.y * 10).toFixed(FIXED_CORRECTION),
        z: (accelerometerData.z * 10).toFixed(FIXED_CORRECTION),
      };
      setData(fixedData);
      setCurrentTilt(
        Math.atan2(fixedData.y, fixedData.x).toFixed(FIXED_CORRECTION)
      );
    });

    let magnetometerData = { x: 0, y: 0, z: 0 };
    const magnetometerSubscription = Magnetometer.addListener((data) => {
      const azimuth = Math.atan2(data.y, data.x) * (180 / Math.PI);

      let direction = "N"; // Default to North

      // Map azimuth angle to cardinal directions
      if (azimuth >= -22.5 && azimuth < 22.5) {
        direction = "N";
      } else if (azimuth >= 22.5 && azimuth < 67.5) {
        direction = "NE";
      } else if (azimuth >= 67.5 && azimuth < 112.5) {
        direction = "E";
      } else if (azimuth >= 112.5 && azimuth < 157.5) {
        direction = "SE";
      } else if (azimuth >= 157.5 || azimuth < -157.5) {
        direction = "S";
      } else if (azimuth >= -157.5 && azimuth < -112.5) {
        direction = "SW";
      } else if (azimuth >= -112.5 && azimuth < -67.5) {
        direction = "W";
      } else if (azimuth >= -67.5 && azimuth < -22.5) {
        direction = "NW";
      }

      setOrientation({ azimuth, direction });
    });
    return () => {
      subscription.remove();
      magnetometerSubscription.remove();
    };
  };

  const calculateDistance = async () => {
    // Store the starting point to calculate distance traveled.
    if (!currentAcc) {
      setCurrentAcc(data.y);
    }

    if (Math.abs(data.y - currentAcc) >= THRESHOLD) {
      const timeDifference = 100;
      const acc = Math.abs(data.y - currentAcc);
      const distance = acc * 0.2;

      setDistanceTraveled(distanceTraveled + distance);

      setCurrentAcc(data.y);
    }
  };

  useEffect(() => {
    calculateDistance();
  }, [data]);

  return (
    <View style={styles.container}>
      <Text>Accelerometer: (in Gs where 1 G = 9.81 m s^-2)</Text>
      <Text>X: {data.x}</Text>
      <Text>Y: {data.y}</Text>
      <Text>Z: {data.z}</Text>
      <Text>Tilt: {currentTilt}</Text>
      <Text>Distance Traveled: {distanceTraveled}</Text>
      <Text>Directions</Text>
      <Text>Azimuth: {orientation.azimuth}</Text>
      <Text>Pitch: {orientation.direction}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
