import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, StatusBar, SafeAreaView, View, TextInput, TouchableOpacity, Image, Modal, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../../assets/colors/colors';
import Barcode from '../components/Barcode';

export default () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputData, setInputData] = useState('');
  const navigation = useNavigation();

  const fetchPrinter = async () => {
    try {
      const value = await AsyncStorage.getItem('address');
      if (value !== null) {
        await BluetoothManager.connect(value)
          .then((connected) => {
            if (connected) {
              ToastAndroid.show(
                'Conectado a Impressora',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
              );
            }
          })
          .catch((error) => {
            if (error) {
              ToastAndroid.show(
                'Ops! Não encontrei a impressora. Verifique se está ligada',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
              );
            }
          })
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchPrinter();
  }, [])

  const handleInputBarcode = (data) => {
    setInputData(data);
    onCodeScanned(inputData);
  };

  const onCodeScanned = (data) => {
    fetch(`http://187.121.201.103:8090/rest/COLETPRC?codbarras=${data}`)
      .then((response) => response.json())
      .then((json) => {
        if (json.produtos[0]) {
          setModalVisible(false);
          navigation.navigate('Produto', { produto: json.produtos[0] });
          BarcodeInput.clear();
        } else {
          ToastAndroid.show(
            'Ops! Esse produto não existe',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
          setModalVisible(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <SafeAreaView style={styles.Container}>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.ModalBarcode}>
          <Barcode onCodeScanned={onCodeScanned} />
          <Text style={styles.ModalText}> Aponte para o Código de Barras </Text>
          <Image
            style={styles.LogoModal}
            source={require('../../assets/logo.png')}
          />
        </View>
      </Modal>

      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Image style={styles.Logo} source={require('../../assets/logo.png')} />

      <SafeAreaView style={styles.Header}>
        <Text style={styles.Text}>
          Digite aqui o Código de Barras do Produto
        </Text>
        <TextInput
          style={styles.BarcodeInput}
          keyboardType="numeric"
          onSubmitEditing={(event) => onCodeScanned(event.nativeEvent.text)}
          ref={(input) => {
            BarcodeInput = input;
          }}
        />
      </SafeAreaView>

      <Text style={styles.Divider}> ou utilize o Leitor abaixo </Text>

      <SafeAreaView style={styles.Header}>
        <TouchableOpacity
          style={styles.BarcodeButton}
          onPress={() => {
            setModalVisible(true);
          }}>
          <Icon
            name="ios-barcode-outline"
            size={35}
            color={colors.background}
          />
          <Text style={styles.TextButton}>
            Abrir o Leitor de Código de Barras
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.BluetoothButton}
          onPress={() => {
            navigation.navigate('Bluetooth');
          }}>
          <Icon name="bluetooth-outline" size={30} color={colors.bluetooth} />
          <Text style={styles.TextButtonBluetooth}>
            Conectar Impressora Bluetooth
          </Text>
        </TouchableOpacity>

      </SafeAreaView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.secondary,
  },
  ModalBarcode: {
    flex: 1,
    margin: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  ModalText: {
    color: colors.textDark,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'RobotoCondensed-Bold',
  },
  Logo: {
    marginBottom: 20,
    width: 180,
    height: 100,
    resizeMode: 'stretch',
  },
  LogoModal: {
    margin: 5,
    width: 120,
    height: 60,
  },
  Text: {
    fontSize: 15,
    fontFamily: 'RobotoCondensed-Regular',
    padding: 10,
  },
  Header: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    fontSize: 15,
    fontFamily: 'RobotoCondensed-Regular',
    padding: 10,
  },
  HeaderBluetooth: {
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    bottom: 0,
    fontSize: 15,
    fontFamily: 'RobotoCondensed-Regular',
    padding: 10,
  },
  BarcodeInput: {
    width: '90%',
    height: 60,
    borderRadius: 10,
    backgroundColor: colors.backgroundDetail,
    textAlign: 'center',
    color: colors.secondary,
    fontSize: 18,
    fontFamily: 'RobotoCondensed-Bold',
  },
  BarcodeButton: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 10,
    fontSize: 15,
    fontFamily: 'RobotoCondensed-Regular',
  },
  BluetoothButton: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: colors.bluetooth,
    padding: 10,
    fontSize: 15,
    fontFamily: 'RobotoCondensed-Regular',
  },
  TextButton: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'RobotoCondensed-Bold',
  },
  TextButtonBluetooth: {
    color: colors.bluetooth,
    fontSize: 15,
    fontFamily: 'RobotoCondensed-Bold',
  },
  Divider: {
    padding: 5,
    fontSize: 15,
    fontFamily: 'RobotoCondensed-Regular',
  },
});
