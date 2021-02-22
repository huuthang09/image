import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
  View,
} from 'react-native';
import {verticalScale, scale} from './ScalingUtils';
import GalleryModal from './component/GalleryModal';
import SaveModal from './component/SaveModal';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
const {width, height} = Dimensions.get('window');
import ImageViewer from 'react-native-image-zoom-viewer';

const App = () => {
  const [imageSelected, setImageSelected] = useState({
    path: '',
    data: null,
  });

  const [saveVisible, setSaveVisible] = useState(false);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [imageDownloadList, setImageDownloadList] = useState([]);
  const [storageVisible, setStorageVisible] = useState(false);

  const openCameraImage = () => {
    ImagePicker.openCamera({
      width: width,
      height: height,
      cropping: false,
      includeBase64: true,
    })
      .then((image) => {
        setImageSelected({
          path: image.path,
          data: image.data,
        });
        setStorageVisible(false);
      })
      .catch((e) => console.log(e));
  };

  const getImageList = () => {
    const ref = storage().ref('image');
    const downloadList = [];
    ref.listAll().then((result) =>
      result.items.forEach(async (e, i) => {
        const url = await storage().ref(e.fullPath).getDownloadURL();
        downloadList.push({
          url: url,
        });
        if (i == result.items.length - 1) {
          setImageDownloadList(downloadList);
        }
      }),
    );
  };

  useEffect(() => {
    getImageList();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <GalleryModal
        openStorage={() => {
          getImageList();
          setGalleryVisible(false);
          setStorageVisible(true);
        }}
        visible={galleryVisible}
        requestClose={(state) => setGalleryVisible(state)}
        imageResult={(image) => {
          setStorageVisible(false);
          setGalleryVisible(false);
          setImageSelected({
            path: image,
          });
        }}
      />
      <SaveModal
        filePath={imageSelected.path}
        base64={imageSelected.data}
        visible={saveVisible}
        requestClose={(state) => {
          setSaveVisible(state);
        }}
      />
      {!storageVisible ? (
        <Image
          style={styles.mainImage}
          source={
            imageSelected.path
              ? {uri: imageSelected.path}
              : require('./assets/empty_image.jpg')
          }
        />
      ) : (
        <View
          style={{width: scale(width), height: verticalScale(height * 0.8)}}>
          <ImageViewer
            imageUrls={imageDownloadList}
            saveToLocalByLongPress={true}
          />
        </View>
      )}

      <SafeAreaView style={styles.bottomTab}>
        <TouchableOpacity onPress={() => setGalleryVisible(true)}>
          <Image style={styles.icon} source={require('./assets/gallery.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openCameraImage()}>
          <Image style={styles.icon} source={require('./assets/camera.png')} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            imageSelected.path
              ? setSaveVisible(true)
              : Alert.alert('Không có hình để lưu')
          }>
          <Image style={styles.icon} source={require('./assets/save.png')} />
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainImage: {
    width: scale(width),
    height: verticalScale(height * 0.8),
    resizeMode: 'cover',
  },

  bottomTab: {
    paddingHorizontal: scale(15),
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  icon: {
    width: scale(50),
    height: scale(50),
  },

  //
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(22),
  },
  modalView: {
    margin: scale(20),
    backgroundColor: 'white',
    borderRadius: scale(20),
    padding: scale(35),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    marginBottom: verticalScale(15),
    backgroundColor: '#F194FF',
    borderRadius: scale(20),
    padding: scale(10),
    width: '100%',
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: verticalScale(15),
    textAlign: 'center',
  },
});

export default App;
