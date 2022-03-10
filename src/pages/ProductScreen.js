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
    await BluetoothEscposPrinter.setBlob(0);
    await BluetoothEscposPrinter.printText("广州俊烨\n\r", {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 3,
      heigthtimes: 3,
      fonttype: 1
    });
    await BluetoothEscposPrinter.setBlob(0);
    await BluetoothEscposPrinter.printText("销售单\n\r", {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
      fonttype: 1
    });
    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
    await BluetoothEscposPrinter.printText("客户：零售客户\n\r", {});
    await BluetoothEscposPrinter.printText("单号：xsd201909210000001\n\r", {});
    // await BluetoothEscposPrinter.printText("日期：" + (dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")) + "\n\r", {});
    await BluetoothEscposPrinter.printText("销售员：18664896621\n\r", {});
    await BluetoothEscposPrinter.printText("--------------------------------\n\r", {});
    let columnWidths = [12, 6, 6, 8];
    await BluetoothEscposPrinter.printColumn(columnWidths,
      [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
      ["商品", '数量', '单价', '金额'], {});
    await BluetoothEscposPrinter.printColumn(columnWidths,
      [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
      ["React-Native定制开发我是比较长的位置你稍微看看是不是这样?", '1', '32000', '32000'], {});
    await BluetoothEscposPrinter.printText("\n\r", {});
    await BluetoothEscposPrinter.printColumn(columnWidths,
      [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
      ["React-Native定制开发我是比较长的位置你稍微看看是不是这样?", '1', '32000', '32000'], {});
    await BluetoothEscposPrinter.printText("\n\r", {});
    await BluetoothEscposPrinter.printText("--------------------------------\n\r", {});
    await BluetoothEscposPrinter.printColumn([12, 8, 12],
      [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
      ["合计", '2', '64000'], {});
    await BluetoothEscposPrinter.printText("\n\r", {});
    await BluetoothEscposPrinter.printText("折扣率：100%\n\r", {});
    await BluetoothEscposPrinter.printText("折扣后应收：64000.00\n\r", {});
    await BluetoothEscposPrinter.printText("会员卡支付：0.00\n\r", {});
    await BluetoothEscposPrinter.printText("积分抵扣：0.00\n\r", {});
    await BluetoothEscposPrinter.printText("支付金额：64000.00\n\r", {});
    await BluetoothEscposPrinter.printText("结算账户：现金账户\n\r", {});
    await BluetoothEscposPrinter.printText("备注：无\n\r", {});
    await BluetoothEscposPrinter.printText("快递单号：无\n\r", {});
    // await BluetoothEscposPrinter.printText("打印时间：" + (dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")) + "\n\r", {});
    await BluetoothEscposPrinter.printText("--------------------------------\n\r", {});
    await BluetoothEscposPrinter.printText("电话：\n\r", {});
    await BluetoothEscposPrinter.printText("地址:\n\r\n\r", {});
    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
    await BluetoothEscposPrinter.printText("欢迎下次光临\n\r\n\r\n\r", {});
    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
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
