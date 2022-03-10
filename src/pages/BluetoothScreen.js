import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, FlatList, SafeAreaView, TouchableOpacity, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default () => {
  const [deviceList, setDeviceList] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    BluetoothManager.isBluetoothEnabled()
    .then((enabled) => {
      console.log(`Bluetooth está habilitado? : ${enabled}`);
    });

    BluetoothManager.enableBluetooth().then(
      (r) => {
        var paired = [];
        if (r && r.length > 0) {
          for (var i = 0; i < r.length; i++) {
            try {
              paired.push(JSON.parse(r[i]));
            } catch (e) {
              console.log(e);
            }
            setDeviceList(paired);
          }
        }
      },
      (err) => {
        alert(err);
      },
    );
  }, []);

  const setBluetoothDevice = async (key, value) => {
    await AsyncStorage.setItem(key, value);
    await BluetoothManager.connect(value) // the device address scanned.
    .then((s)=>{
      console.log('Conectado à ' + value);
      navigation.pop();
    }),(e)=>{
      console.log('Falhou Conexão')
    }       
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={deviceList}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.deviceButton}
            onPress={() => {
              setBluetoothDevice('address', item.address);
            }}>
            <SafeAreaView style={styles.containerItem}>
              <Text style={styles.deviceName}>{item.name}</Text>
              <Text style={styles.deviceAddress}>{item.address}</Text>
            </SafeAreaView>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
  },
  containerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderColor: '#C9C9C9',
    borderWidth: 1,
    borderRadius: 10,
  },
  deviceButton: {
    padding: 10,
  },
  deviceName: {
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
