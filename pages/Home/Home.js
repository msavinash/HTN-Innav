import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { Accelerometer, Magnetometer, Gyroscope } from "expo-sensors";
import { useEffect, useState } from "react";
import Map from "../../assets/focus.png";
import DotIcon from "../../assets/arrow.png";
import { AStarFinder, Grid } from "pathfinding";
import Svg, { Line, Circle } from "react-native-svg";

export default function Home() {
  const THRESHOLD = 0.5;
  const FIXED_CORRECTION = 4;
  const CORRECTION = 0.1448;

  const [dotPosition, setDotPosition] = useState({ top: 400, left: 250 });
  const [data, setData] = useState({});
  const [currentTilt, setCurrentTilt] = useState(0);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [currentAcc, setCurrentAcc] = useState();
  const [orientation, setOrientation] = useState({
    azimuth: 0,
    direction: "N", // Initialize with North
  });
  const [turnDirection, setTurnDirection] = useState("");
  const [currentX, setCurrentX] = useState("");
  const [path, setPath] = useState([]);
  const finder = new AStarFinder();
  const mapGrid = [
    // Your map grid here, for example:
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  ];

  useEffect(() => {
    subscribe();
  }, []);

  useEffect(() => {
    const start = { x: 9, y: 2 };
    const end = { x: 7, y: 7 };

    calculatePathToRoom(start, end);
  }, []);

  const calculatePathToRoom = (start, end) => {
    const grid = new Grid(mapGrid);
    const path = finder.findPath(start.x, start.y, end.x, end.y, grid);

    setPath(path);
  };

  const renderPath = () => {
    // console.log(path);
    return (
      <Svg height="300" width="500" style={{ position: "absolute" }}>
        {path.map((point, index) => {
          if (index < path.length - 1) {
            const nextPoint = path[index + 1];
            return (
              <Line
                key={index}
                x1={point[0] * 10} // Adjust the multiplication factor to match your grid size
                y1={point[1] * 10}
                x2={nextPoint[0] * 10}
                y2={nextPoint[1] * 10}
                stroke="red"
                strokeWidth="100px"
              />
            );
          }
          return null;
        })}
        {/* Optionally, mark the start and end points */}
        {/* <Circle
          cx={path[0][0] * 100}
          cy={path[0][1] * 100}
          r="5"
          fill="green"
        />
        <Circle
          cx={path[path.length - 1][0] * 100}
          cy={path[path.length - 1][1] * 100}
          r="5"
          fill="blue"
        /> */}
      </Svg>
    );
  };

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

    const gyro = Gyroscope.addListener((data) => {
      const gyroX = data.x.toFixed(FIXED_CORRECTION);

      if (gyroX > 1) {
        console.log("Turning Right!");
        setTurnDirection("Turning Right");
      } else if (gyroX < -1) {
        console.log("Turning Left!");
        setTurnDirection("Turning Left");
      }
    });

    return () => {
      subscription.remove();
      magnetometerSubscription.remove();
      gyro.remove();
    };
  };

  const calculateDistance = async () => {
    // Store the starting point to calculate distance traveled.
    if (!currentAcc || !currentX) {
      setCurrentAcc(data.y);
      setCurrentX(data.x);
    }

    if (Math.abs(data.y - currentAcc) >= THRESHOLD) {
      const timeDifference = 100;

      const xThreshold = 1;
      const zThreshold = 10.0;

      if (
        Math.abs(data.x - currentX) > xThreshold ||
        Math.abs(data.z) > zThreshold
      ) {
        return;
      }

      const acc = Math.abs(data.y - currentAcc);
      const distance = acc * CORRECTION;

      setDistanceTraveled(distanceTraveled + distance);

      setCurrentAcc(data.y);
      setCurrentX(data.x);

      calculateNewPosition();
    }
  };

  useEffect(() => {
    calculateDistance();
  }, [data]);

  const calculateNewPosition = () => {
    const pixelsPerFoot = 1; // Adjust based on the scale of your map
    const angle = orientation.azimuth;

    // const deltaX = distanceTraveled * Math.cos(angle) * pixelsPerFoot;
    const deltaY = distanceTraveled * pixelsPerFoot;

    setDotPosition({
      top: dotPosition.top - deltaY,
      // left: dotPosition.left + deltaX,
    });
  };

  return (
    <View style={styles.container}>
      {/* <Text>Accelerometer: (in Gs where 1 G = 9.81 m s^-2)</Text>
      <Text>X: {data.x}</Text>
      <Text>Y: {data.y}</Text>
      <Text>Z: {data.z}</Text>
      <Text>Tilt: {currentTilt}</Text>
      <Text>Distance Traveled: {distanceTraveled}</Text>
      <Text>Directions</Text>
      <Text>Azimuth: {orientation.azimuth}</Text>
      <Text>Pitch: {orientation.direction}</Text>
      <Text>Turn Direction: {turnDirection}</Text>
      <StatusBar style="auto" /> */}
      <Image style={styles.image} source={Map} resizeMode="center" />
      <Image
        style={[
          styles.dot,
          {
            top: dotPosition.top,
            left: dotPosition.left,
            transform: [{ rotate: `${orientation.azimuth}deg` }],
          },
        ]}
        source={DotIcon}
      />
      {renderPath()}
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
  image: {},
  dot: {
    position: "absolute",
    width: 20,
    height: 20,
  },
});
