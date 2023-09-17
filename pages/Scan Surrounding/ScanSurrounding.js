import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Camera } from "expo-camera";
import axios from "axios";

export default function ScanSurrounding() {
  const [startCamera, setStartCamera] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState();
  let camera = Camera;

  const API_URL = "https://hackthenorth-399301.dt.r.appspot.com/predict";

  const uploadImage = async (imageUri) => {
    try {
      // Create a FormData object and append the image
      // const formData = new FormData();

      // formData.append("file", {
      //   uri: imageUri,
      //   type: "image/png", // Adjust the content type based on the image type
      //   name: "image.png", // The name to be used on the server
      // });

      // // Send the image in a POST request using fetch
      // fetch(API_URL, {
      //   method: "POST",
      //   body: formData,
      //   headers: {
      //     "Content-Type": `${
      //       Platform.OS === "ios" ? "multipart/form-data" : "application/json"
      //     }`,
      //     // Add any other headers as needed
      //   },
      // })
      //   .then((response) => {
      //     if (response.status >= 200 && response.status < 300) {
      //       return response.json(); // Parse response data if it's in JSON format
      //     } else {
      //       throw new Error("HTTP request error");
      //     }
      //   })
      //   .then((responseData) => {
      //     // Handle the response data here
      //     console.log("Response Data:", responseData);
      //   })
      //   .catch((error) => {
      //     // Handle any errors that occurred during the request
      //     console.error("Request Error:", error);
      //   });

      // Create a FormData object and append the file
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/png", // Adjust the content type based on the file type
        name: "test.png", // The name to be used on the server
      });

      // Determine the content type based on the platform
      const contentType =
        Platform.OS === "ios" ? "multipart/form-data" : "application/json";

      // console.log(form);
      // Create the fetch request
      await axios(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": contentType,
        },
        data: formData,
      })
        .then((response) => {
          // Handle the success response here
          console.log("File upload successful:", response.data);
        })
        .catch((error) => {
          // Handle any errors here
          console.error("File upload error:", error);
        });
    } catch (error) {
      console.error("File upload error:", error);
    }
  };

  const scanLtn = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      // start the camera
      setStartCamera(true);
    } else {
      Alert.alert("Access denied");
    }
  };

  const takePictureLtn = async () => {
    if (!camera) return;
    const photo = await camera.takePictureAsync();
    console.log(photo);
    console.log(photo.uri);
    await uploadImage(photo.uri);

    setPreviewVisible(true);
    setCapturedImage(photo);
  };

  const CameraPreview = ({ photo }) => {
    return (
      <View
        style={{
          backgroundColor: "transparent",
          flex: 1,
          width: "100%",
          height: "100%",
        }}
      >
        <ImageBackground
          source={{ uri: photo && photo.uri }}
          style={{
            flex: 1,
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {previewVisible && capturedImage ? (
        <CameraPreview photo={capturedImage} />
      ) : startCamera ? (
        <Camera
          style={{ flex: 1, width: "100%" }}
          ref={(r) => {
            camera = r;
          }}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              backgroundColor: "transparent",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                position: "absolute",
                bottom: 0,
                flexDirection: "row",
                flex: 1,
                width: "100%",
                padding: 20,
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  alignSelf: "center",
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={takePictureLtn}
                  style={{
                    width: 70,
                    height: 70,
                    bottom: 0,
                    borderRadius: 50,
                    backgroundColor: "#fff",
                  }}
                />
              </View>
            </View>
          </View>
        </Camera>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={scanLtn}
            style={{
              width: 130,
              borderRadius: 4,
              backgroundColor: "#14274e",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: 40,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Take picture
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
