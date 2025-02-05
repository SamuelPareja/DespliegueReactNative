import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export function SettingsScreen({ route }) {
    const navigation = useNavigation();
    const [incidencias, setIncidencias] = useState([]);

    useEffect(() => {
        if (route.params?.nuevaIncidencia) {
            setIncidencias([...incidencias, route.params.nuevaIncidencia]);
        }
    }, [route.params?.nuevaIncidencia]);

    const transicionarIncidencia = (id, nuevoEstado) => {
        setIncidencias(incidencias.map(inc => 
            inc.id === id ? {...inc, estado: nuevoEstado} : inc
        ));
    };

    const borrarIncidencia = (id) => {
        setIncidencias(incidencias.filter(inc => inc.id !== id));
    };

    const renderIncidencia = ({ item }) => (
        <View style={styles.incidenciaContainer}>
            <Text style={styles.titulo}>{item.titulo}</Text>
            {item.estado === 'EN TRÁMITE' ? (
                <View>
                    <Text style={[styles.estado, { color: '#f19100' }]}>{item.estado}</Text>
                    <TouchableOpacity onPress={() => transicionarIncidencia(item.id, 'SOLUCIONADO')}>
                        <Text style={styles.botonTransicion}>Marcar como Solucionado</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => transicionarIncidencia(item.id, 'DENEGADA')}>
                        <Text style={styles.botonTransicion}>Marcar como Denegada</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <Text style={[styles.estado, { color: item.estado === 'SOLUCIONADO' ? '#9fc63b' : '#ff3b3b' }]}>{item.estado}</Text>
                    <TouchableOpacity onPress={() => borrarIncidencia(item.id)}>
                        <Text style={styles.botonBorrar}>Borrar Incidencia</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>INCIDENCIAS</Text>

            <FlatList
                data={incidencias}
                keyExtractor={item => item.id}
                renderItem={renderIncidencia}
            />

            <TouchableOpacity 
                style={styles.botonFlotante} 
                onPress={() => navigation.navigate('NuevaIncidenciaScreen')}
            >
                <Ionicons name="add" size={30} color="black" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1B1B1B', // Color de fondo tomado de la otra página
        padding: 20,
    },
    header: {
        fontSize: 26,
        color: '#9fc63b',
        textAlign: 'center',
        marginBottom: 60,
        marginTop: 40,
        fontWeight: 'bold',
    },
    incidenciaContainer: {
        backgroundColor: '#333', // Color oscuro para las tarjetas
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    titulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#9fc63b',
    },
    estado: {
        fontSize: 14,
        marginTop: 5,
    },
    botonFlotante: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#9fc63b', // Color verde del botón
        width: 55, // Tomando referencia del otro botón
        height: 55,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 5,
    },
    botonTransicion: {
        color: '#9fc63b',
        marginTop: 5,
        textDecorationLine: 'underline',
    },
    botonBorrar: {
        color: '#ff3b3b',
        marginTop: 5,
        textDecorationLine: 'underline',
    }
});

