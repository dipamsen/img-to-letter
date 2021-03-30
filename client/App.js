import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default class App extends React.Component {
  state = {
    image: null,
    prediction: null,
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>Image Recognition - Alphabet</Text>
        <Button title="Choose Image" onPress={this.pickImage} color="red" />
        <Text>Choose Image file for Alphabet Recognition</Text>
        {this.state.prediction ? (
          <>
            <Text>Prediction Results: {this.state.prediction}</Text>
          </>
        ) : null}
      </View>
    );
  }
  pickImage = async () => {
    const permissions = await ImagePicker.getCameraPermissionsAsync();
    if (permissions.granted) {
      const picked = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        mediaTypes: ImagePicker.MediaTypeOptions.All,
      });
      const imageUrl = picked.uri;
      this.setState({ image: imageUrl });
      this.predictImage();
    }
  };
  predictImage = async () => {
    const API_URL = ""; // ngrok url;
    if (!this.state.image) return;
    const image = this.state.image;
    const extension = this.state.image.slice(0, -3);
    const blob = { url: image, size: image.length };
    const response = await fetch(API_URL, {
      method: "POST",
      body: new Blob(blob),
      headers: {
        "Content-Type": `image/${extension}`,
      },
    });
    if (response.ok) {
      const { pred } = await response.json();
      console.log("Predicted: ", pred);
      this.setState({
        prediction: pred,
      });
    }
  };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
