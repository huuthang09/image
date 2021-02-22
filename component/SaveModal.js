import React from 'react'
import { StyleSheet, Dimensions, TouchableOpacity, Modal, View, Text, Alert } from 'react-native'
import RNFS, { APP_NAME } from "react-native-fs"
import { verticalScale, scale } from '../ScalingUtils'
import storage from '@react-native-firebase/storage'

const SaveModal = ({ visible, requestClose, base64, filePath,  }) => {

    const saveFileToFirebase = async (path) => {
        try {
            const reference = storage().ref(`image/${new Date().getTime()}.png`)
            await reference.putFile(path).then(() => {
                requestClose(false)
                Alert.alert("Lưu thành công")
            })
        } catch (error) {
            Alert.alert("Có lỗi xảy ra")
            console.log(error)
        }
    }

    const saveFileLocal = (base64) => {
        const albumPath = `${RNFS.PicturesDirectoryPath}/${APP_NAME}`;
        const fileName = `${new Date().getTime()}.png`;
        const filePathInCache = `${RNFS.CachesDirectoryPath}/${fileName}`;
        const filePathInAlbum = `${albumPath}/${fileName}`;

        return RNFS.mkdir(albumPath)
            .then(() => {
                RNFS.writeFile(filePathInCache, base64, 'base64').then(() => RNFS.copyFile(filePathInCache, filePathInAlbum)
                    // Next step to show album without the need to re-boot your device:
                    .then(() => RNFS.scanFile(filePathInAlbum))
                    .then(() => {
                        Alert.alert("Lưu thành công")
                        requestClose(false)
                    }));
            })
            .catch((error) => {
                console.log('Could not create dir', error);
            });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => requestClose(false)}
        >

            <TouchableOpacity
                onPress={() => requestClose(false)}
                style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Chọn 1 trong 2 loại:</Text>

                    <TouchableOpacity
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                        onPress={() => saveFileLocal(base64)}
                    >
                        <Text style={styles.textStyle}>Lưu vào máy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.openButton}
                        onPress={() => saveFileToFirebase(filePath)}
                    >
                        <Text style={styles.textStyle}>Lưu trên server</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: verticalScale(22)
    },
    modalView: {
        margin: scale(20),
        backgroundColor: "white",
        borderRadius: scale(20),
        padding: scale(35),
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        marginBottom: verticalScale(15),
        backgroundColor: "#F194FF",
        borderRadius: scale(20),
        padding: scale(10),
        width: '100%',
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: verticalScale(15),
        textAlign: "center"
    }
})

export default SaveModal