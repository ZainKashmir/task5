import {
  StyleSheet,
  View,
  PermissionsAndroid,
  ScrollView,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import Swiper from 'react-native-swiper';

export default function Gallery() {
  const [nodes, setNodes] = useState([]);
  const [detailViewVisible, setDetailViewVisibility] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    checkPermission().then(() => {
      getPhotos();
    });
  }, []);

  const checkPermission = async () => {
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    console.log(hasPermission);

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Image gallery app permissions',
        message: 'Image gallery needs your permission to access your photos',
        buttonPositive: 'OK',
      },
    );

    return status === 'granted';
  };

  const getPhotos = async () => {
    const photos = await CameraRoll.getPhotos({
      first: 10,
    });
    console.log(photos);

    setNodes(photos.edges.map(edge => edge.node));
  };

  return (
    <ScrollView>
      {detailViewVisible ? (
        <Swiper loop={false} index={selectedIndex}>
          {nodes.map((node, index) => (
            <View key={index} style={styles.container}>
              <Image
                style={styles.Ifimage}
                resizeMode="contain"
                source={{
                  uri: node.image.uri,
                }}
              />
              <View style={styles.button}>
                <Button
                  title="Close"
                  onPress={() => {
                    setDetailViewVisibility(false);
                  }}
                />
              </View>
            </View>
          ))}
        </Swiper>
      ) : (
        <View style={styles.elseViewContainer}>
          {nodes.map((node, index) => (
            <TouchableOpacity
              key={index}
              style={styles.elseTouchable}
              onPress={() => {
                setDetailViewVisibility(true);
                setSelectedIndex(index);
              }}>
              <Image
                style={styles.elseImage}
                source={{
                  uri: node.image.uri,
                }}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
  },
  Ifimage: {
    width: '100%',
    height: 300,
    flex: 1,
  },
  button: {
    position: 'absolute',
    bottom: 60,
  },
  elseViewContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  elseTouchable: {
    height: 100,
    minWidth: 100,
    flex: 1,
  },
  elseImage: {
    height: 100,
    minWidth: 100,
    flex: 1,
  },
});
