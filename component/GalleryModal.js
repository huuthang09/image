import React from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  View,
  Text,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {verticalScale, scale} from '../ScalingUtils';
const {width, height} = Dimensions.get('window');

const GalleryModal = ({visible, requestClose, imageResult, openStorage}) => {
  const openPicker = () => {
    ImagePicker.openPicker({
      width: width,
      height: height,
      cropping: false,
    })
      .then((image) => {
        imageResult(image.path);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => requestClose(false)}>
      <TouchableOpacity
        onPress={() => requestClose(false)}
        style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Chọn 1 trong 2 loại:</Text>

          <TouchableOpacity
            style={{...styles.openButton, backgroundColor: '#2196F3'}}
            onPress={() => openPicker()}>
            <Text style={styles.textStyle}>Xem hình trong máy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.openButton}
            onPress={() => openStorage()}>
            <Text style={styles.textStyle}>Xem hình lên server</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
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

export default GalleryModal;
