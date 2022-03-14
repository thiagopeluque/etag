import React from 'react';
import { StyleSheet, Text, StatusBar, SafeAreaView, View, Image, TouchableOpacity } from 'react-native';
import { BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';

import colors from '../../assets/colors/colors';

export default () => {
  const route = useRoute();
  const produto = route.params.produto;

  async function printLabel() {
    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
    await BluetoothEscposPrinter.printText(produto.descricao.substring(0, 30)+"\n\r", {});
    await BluetoothEscposPrinter.printText("Cod: " + produto.codigo + "   Un: " + produto.unid_medida + "\n\r", {});
    await BluetoothEscposPrinter.printText("Fabricante: " + produto.fabricante + "\n\r", {});
    await BluetoothEscposPrinter.printText("R$ "+ produto.preco_venda.toFixed(2),{
      encoding:'GBK',
      codepage:0,
      widthtimes:1,
      heigthtimes:1,
      fonttype:0
    });
    // await BluetoothEscposPrinter.printText("--------------------------------\n\r", {});
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
            R$ {produto.ultimo_preco.toFixed(2)}
          </Text>
        </View>
      </View>
      <View style={styles.PriceContainer}>
        <Text style={styles.PriceTitle}> PREÇO ATUAL </Text>
        <Text style={styles.PriceInfo}>
          R$ {produto.preco_venda.toFixed(2)}
        </Text>
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
      <View style={styles.PrintContainer}>
        <View style={styles.PrintContainerLogo}>
          <Image
            style={styles.Logo}
            source={require('../../assets/logo.png')}
          />
        </View>
        <View style={styles.PrintContainerButton}>
          <TouchableOpacity style={styles.PrintButton} onPress={() => {
            printLabel();
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
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  ImageStretch: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
  },
  ProductTitle: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 30,
    width: '90%',
    color: colors.primary,
    textAlign: 'center',
    fontFamily: 'RobotoCondensed-Bold',
  },
  InfoContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: '20%',
  },
  InfoContainerTitle: {
    flex: 1,
    width: 50,
    // backgroundColor: '#C9C9C9'
  },
  InfoContainerInfo: {
    flex: 1,
    width: 50,
    // backgroundColor: '#A8A8A8'
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
    paddingBottom: 20,
    paddingTop: 20,
    width: '100%',
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
    lineHeight: 55,
    textAlign: 'center',
    alignItems: 'center',
    fontFamily: 'RobotoCondensed-Bold',
    color: colors.price,
  },
  PrintContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: '20%',
  },
  PrintContainerLogo: {
    flex: 1,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#C9C9C9'
  },
  PrintContainerButton: {
    flex: 2,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#A8A8A8'
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
