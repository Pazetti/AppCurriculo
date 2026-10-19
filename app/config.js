import { Platform } from 'react-native';

// ============================================================
// URL DA API
// - Navegador (web) ................. http://localhost:3000
// - Emulador Android ................ http://10.0.2.2:3000
// - Simulador iOS ................... http://localhost:3000
// - Celular físico (Expo Go) ........ use o IP do seu PC na rede,
//                                     ex.: http://192.168.0.15:3000
// Se for testar no celular físico, troque IP_DO_PC abaixo.
// ============================================================
const IP_DO_PC = null; // exemplo: '192.168.0.15'

const host = IP_DO_PC || (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');

export const API_URL = `http://${host}:3000/api`;
