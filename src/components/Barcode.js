import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function Barcode(props) {

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarcode = ({data}) => {
        setScanned(true);
        props.onCodeScanned(data);
    };
    
    if (hasPermission === null) return <Text>Solicitando acesso a Câmera</Text>;
    if (!hasPermission) return <Text>Você não deu Permissão</Text>;

    return (
        <View style={styles.Container}>
            <BarCodeScanner 
                style={[StyleSheet.absoluteFill, styles.Barcode]}
                onBarCodeScanned={scanned ? undefined : handleBarcode}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    Container: {
        width: '90%',
        height: '65%',
    },
    Barcode: {
        borderRadius: 5,
    }
});