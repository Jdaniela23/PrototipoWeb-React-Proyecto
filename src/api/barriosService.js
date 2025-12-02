import axios from 'axios';
// Asegúrate de que ENDPOINTS esté importado correctamente desde su ubicación
import { ENDPOINTS } from './apiConfig'; 

// Función auxiliar para obtener el token de autenticación
const getAuthToken = () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        console.warn("Token no encontrado en localStorage");
        return null;
    }
    return token;
};

// --- Funciones CRUD para Barrios ---
export const getListaBarrios = async () => {
    try {
        const response = await axios.get(ENDPOINTS.BARRIOS.GET_ALL, {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        // Esperamos algo como: [{ id: 1, nombre: 'El Trapiche', municipio: 'Bello' }, ...]
        return response.data; 
    } catch (error) {
        console.error("Error al obtener la lista de barrios:", error.response?.data || error.message);
        return [];
    }
};

/* Obtener todos los Barrios/Zonas con sus costos de domicilio */
// NOTA: Esta función es la que usarás en FormPedido para cargar las zonas.
export const getBarriosMunicipios = async () => {
    try {
        const response = await axios.get(ENDPOINTS.BARRIOS.GET_ALL, {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        // La data esperada es un array de objetos: 
        // [{ nombreBarrio: 'Niquia', municipio: 'Bello', costoFijo: 0 }, ...]
        return response.data; 
    } catch (error) {
        console.error("Error al obtener los barrios y sus costos:", error.response?.data || error.message);
        throw error;
    }
};

/* Obtener un Barrio/Zona por ID */
export const getBarrioById = async (id) => {
    try {
        const response = await axios.get(ENDPOINTS.BARRIOS.GET_BY_ID(id), {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al obtener el barrio ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

/* Crear nuevo Barrio/Zona */
export const createBarrio = async (data) => {
    try {
        const response = await axios.post(ENDPOINTS.BARRIOS.CREATE, data, {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error al crear el barrio:", error.response?.data || error.message);
        throw error;
    }
};

/* Actualizar Barrio/Zona */
export const updateBarrio = async (id, data) => {
    try {
        const response = await axios.put(ENDPOINTS.BARRIOS.UPDATE(id), data, {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar el barrio ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

/* Eliminar Barrio/Zona */
export const deleteBarrio = async (id) => {
    try {
        const response = await axios.delete(ENDPOINTS.BARRIOS.DELETE(id), {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar el barrio ${id}:`, error.response?.data || error.message);
        
        // Manejo de error de conflicto (ej. si el barrio está en uso)
        if (error.response && error.response.status === 409) {
            const backendMessage = error.response.data.message || 'Error de conflicto (409): No se puede eliminar el barrio.';
            const conflictError = new Error(backendMessage);
            conflictError.response = error.response; 
            throw conflictError;
        } else {
            throw error;
        }
    }
};