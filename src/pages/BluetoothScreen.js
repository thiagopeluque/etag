import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, FlatList, SafeAreaView, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import { useNavigation } from '@react-navigation/native';
import { View } from 'native-base';

import colors from '../../assets/colors/colors';

export default () => {
  const [deviceList, setDeviceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    BluetoothManager.isBluetoothEnabled()
    .then((enabled) => {
      console.log(`Bluetooth está habilitado? : ${enabled}`);
    });

    BluetoothManager.enableBluetooth().then(
      (devices) => {
        var paired = [];
        if (devices && devices.length > 0) {
          for (var i = 0; i < devices.length; i++) {
            try {
              paired.push(JSON.parse(devices[i]));
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
    setLoading(true);
    await BluetoothManager.connect(value)
    .then((connected)=>{
      if(connected) {
        ToastAndroid.show(
          'Conectado a Impressora',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
        setLoading(false);
        navigation.pop();
      }
    })
    .catch((error)=>{
      if(error){
        ToastAndroid.show(
          'Ops! Não encontrei a impressora',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      }
    })       
  };

  return (
    <SafeAreaView style={styles.container}>
      { loading ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
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
      )}
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  containerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    // borderColor: '#C9C9C9',
    // borderWidth: 1,
    // borderRadius: 10,
  },
  deviceButton: {
    padding: 5,
  },
  deviceName: {
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
