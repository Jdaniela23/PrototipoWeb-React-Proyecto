import axios from 'axios';
// Asegúrate de que ENDPOINTS esté importado correctamente
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

// --- Funciones CRUD para Municipios ---

/**
 * @description Obtiene la lista completa de municipios, incluyendo el costo de domicilio.
 * @returns {Promise<Array<{ id: number, nombre: string, costoDomicilio: number }>>}
 */
export const getListaMunicipios = async () => {
    try {
        const response = await axios.get(ENDPOINTS.MUNICIPIOS.GET_ALL, {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        // La data esperada es un array con el ID, Nombre y costoDomicilio
        return response.data; 
    } catch (error) {
        console.error("Error al obtener la lista de municipios:", error.response?.data || error.message);
        return [];
    }
};

/* Obtener un Municipio por ID */
export const getMunicipioById = async (id) => {
    try {
        const response = await axios.get(ENDPOINTS.MUNICIPIOS.GET_BY_ID(id), {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al obtener el municipio ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

/* Crear nuevo Municipio */
export const createMunicipio = async (data) => {
    try {
        const response = await axios.post(ENDPOINTS.MUNICIPIOS.CREATE, data, {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error al crear el municipio:", error.response?.data || error.message);
        throw error;
    }
};

/* Actualizar Municipio */
export const updateMunicipio = async (id, data) => {
    try {
        const response = await axios.put(ENDPOINTS.MUNICIPIOS.UPDATE(id), data, {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar el municipio ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

/* Eliminar Municipio */
export const deleteMunicipio = async (id) => {
    try {
        const response = await axios.delete(ENDPOINTS.MUNICIPIOS.DELETE(id), {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar el municipio ${id}:`, error.response?.data || error.message);
        
        // Manejo de error de conflicto (ej. si el municipio está en uso o tiene barrios asociados)
        if (error.response && error.response.status === 409) {
            const backendMessage = error.response.data.message || 'Error de conflicto (409): No se puede eliminar el municipio, ya que está asociado a otros datos (ej. barrios).';
            const conflictError = new Error(backendMessage);
            conflictError.response = error.response; 
            throw conflictError;
        } else {
            throw error;
        }
    }
};