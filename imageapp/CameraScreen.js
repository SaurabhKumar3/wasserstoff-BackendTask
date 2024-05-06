import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { RNCamera } from 'react-native-camera';

const CameraScreen = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);

  const takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      setPhoto(data.uri);
    }
  };
  const sendImageToMongo = async (imageData, text) => {
    try {
      const response = await axios.post('http://localhost:5000/api/upload', {
        imageData,
        text,
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error sending image to MongoDB:', error);
    }
  };
  

  return (
    <View style={{ flex: 1 }}>
      <RNCamera
        ref={(ref) => {
          this.camera = ref;
        }}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button title="Take Picture" onPress={takePicture} />
          <Button title="Save Photo" onPress={sendImageToMongo} />
        </View>
      </RNCamera>
    </View>
  );
};

export default CameraScreen;
