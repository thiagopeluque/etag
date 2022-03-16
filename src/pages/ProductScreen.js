import React from 'react';
import { StyleSheet, Text, StatusBar, SafeAreaView, View, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import { BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

import colors from '../../assets/colors/colors';

export default () => {
  const route = useRoute();
  const produto = route.params.produto;

  async function printVerticalLabel() {
    try {
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      await BluetoothEscposPrinter.setBlob(1);
      await BluetoothEscposPrinter.printText(produto.descricao.substring(0, 30)+"\n\r", {});
      await BluetoothEscposPrinter.setBlob(0);
      await BluetoothEscposPrinter.printText("Cod: " + produto.codigo + "   Un: " + produto.unid_medida + "\n\r", {});
      await BluetoothEscposPrinter.printText("Fabricante: " + produto.fabricante + "\n\r", {});
      await BluetoothEscposPrinter.printText("R$ " + (produto.preco_venda.toFixed(2)) + "\n\r",{
        encoding:'Windows-1252',
        codepage:0,
        widthtimes:1,
        heigthtimes:1,
        fonttype:2
      });
      await BluetoothEscposPrinter.printBarCode(produto.codigo_barras, BluetoothEscposPrinter.BARCODETYPE.JAN13, 3, 60, 0, 2);
      await BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {});
      // await BluetoothEscposPrinter.printPic(logoBase64, {width: 200, left: 40});
    } catch {
      const value = await AsyncStorage.getItem('address');
      if (value !== null) {
        ToastAndroid.show(
          'Estou conectado porém a impressora está desligada',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      } else {
        ToastAndroid.show(
          'Você ainda não se conectou com uma impressora',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      }
    }
    
  }
  
  return (
    <SafeAreaView style={styles.Container}>
      
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      <View style={styles.ImageContainer}>
        <Image
          style={styles.ImageStretch}
          source={{ uri: produto.url_produto }}
        />
        <Text style={styles.ProductTitle}>
          {produto.descricao.substring(0, 45)}
        </Text>
      </View>

      <View style={styles.InfoContainer}>
        <View style={styles.InfoContainerTitle}>
          <Text style={styles.ProductInfoTitle}> Código do Produto: </Text>
          <Text style={styles.ProductInfoTitle}> Estoque Atual: </Text>
          <Text style={styles.ProductInfoTitle}> Fabricante: </Text>
          <Text style={styles.ProductInfoTitle}> Unidade de Medida: </Text>
          <Text style={styles.ProductInfoTitle}> Preço Anterior: </Text>
        </View>
        <View style={styles.InfoContainerInfo}>
          <Text style={styles.ProductInfo}> {produto.codigo} </Text>
          <Text style={styles.ProductInfo}>
            {produto.estoque_atu} unidade(s)
          </Text>
          <Text style={styles.ProductInfo}> {produto.fabricante} </Text>
          <Text style={styles.ProductInfo}> {produto.unid_medida} </Text>
          <Text style={styles.ProductInfo}>
            {produto.ultimo_preco.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
          </Text>
        </View>
      </View>
      
      <View style={styles.InfoContainer}>
        <View style={styles.InfoContainerTitle}>
          <Text style={styles.ProductInfoTitle}> Média de Venda: </Text>
          <Text style={styles.ProductInfoTitle}> Última Saída: </Text>
          <Text style={styles.ProductInfoTitle}> Previsão de Compra: </Text>
        </View>
        <View style={styles.InfoContainerInfo}>
          <Text style={styles.ProductInfo}>{produto.media_12} unidade(s)</Text>
          <Text style={styles.ProductInfo}>
            {produto.dt_ult_saida.substr(6, 2) +
              '/' +
              produto.dt_ult_saida.substr(4, 2) +
              '/' +
              produto.dt_ult_saida.substr(0, 4)}
          </Text>
          <Text style={styles.ProductInfo}>
            {produto.prev_compra} unidade(s)
          </Text>
        </View>
      </View>

      <View style={styles.PriceContainer}>
        <Text style={styles.PriceTitle}> PREÇO ATUAL </Text>
        <Text style={styles.PriceInfo}>
          {produto.preco_venda.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
        </Text>
      </View>
      
      <View style={styles.PrintContainer}>
        <View style={styles.PrintContainerLogo}>
          <Image
            style={styles.Logo}
            source={require('../../assets/logo.png')}
          />
        </View>
        <View style={styles.PrintContainerButton}>
          <TouchableOpacity style={styles.PrintButton} onPress={() => {
            printVerticalLabel();
          }}>
            <Icon name="ios-print-outline" size={35} color={colors.textLight} />
            <Text style={styles.TextPrintButton}> Imprimir Etiqueta </Text>
          </TouchableOpacity>
        </View>
      </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  ImageContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  ImageStretch: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
  ProductTitle: {
    fontSize: 25,
    width: '50%',
    color: colors.primary,
    fontFamily: 'RobotoCondensed-Bold',
  },
  InfoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ProductInfoTitle: {
    fontSize: 16,
    textAlign: 'right',
    alignItems: 'center',
    fontFamily: 'RobotoCondensed-Bold',
  },
  ProductInfo: {
    fontSize: 16,
    textAlign: 'left',
    alignItems: 'center',
    fontFamily: 'RobotoCondensed-Regular',
  },
  PriceContainer: {
    flex: 1,
    justifyContent: 'space-evenly'
  },
  PriceTitle: {
    fontSize: 30,
    textAlign: 'center',
    alignItems: 'center',
    color: colors.primary,
    fontFamily: 'RobotoCondensed-Bold',
  },
  PriceInfo: {
    fontSize: 50,
    textAlign: 'center',
    alignItems: 'center',
    fontFamily: 'RobotoCondensed-Bold',
    color: colors.price,
  },
  PrintContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  PrintContainerLogo: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  PrintContainerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  PrintButton: {
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
  TextPrintButton: {
    color: colors.textLight,
    fontSize: 15,
    fontFamily: 'RobotoCondensed-Bold',
  },
});
