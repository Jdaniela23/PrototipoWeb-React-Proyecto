import axios from 'axios';
import { ENDPOINTS } from './apiConfig';

const getAuthToken = () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        console.warn("Token no encontrado en localStorage");
        return null;
    }
    return token;
};

/*  Obtener todos los colores */
export const getColores = async () => {
  try {
    const response = await axios.get(ENDPOINTS.COLORES.GET_ALL, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los colores:", error.response?.data || error.message);
    throw error;
  }
};

/* Obtener un color por ID */
export const getColorById = async (id) => {
  try {
    const response = await axios.get(ENDPOINTS.COLORES.GET_BY_ID(id), {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el color ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

/* Crear color */
export const createColor = async (data) => {
  try {
    const response = await axios.post(ENDPOINTS.COLORES.CREATE, data, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear el color:", error.response?.data || error.message);
    throw error;
  }
};

/* Actualizar color */
export const updateColor = async (id, data) => {
  try {
    const response = await axios.put(ENDPOINTS.COLORES.UPDATE(id), data, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el color ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

/* Eliminar color */
export const deleteColor = async (id) => {
    try {
        const response = await axios.delete(ENDPOINTS.COLORES.DELETE(id), {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar el color ${id}:`, error.response?.data || error.message);
        
        // 🚩 LÓGICA CLAVE CORREGIDA 🚩
        if (error.response && error.response.status === 409) {
            // El backend envió un 409 (Conflict) con un mensaje detallado.
            const backendMessage = error.response.data.message || 'Error de conflicto (409) desconocido.';
            
            // Creamos y lanzamos un nuevo Error usando el mensaje del backend.
            const conflictError = new Error(backendMessage);
            // Opcional: Adjuntar la respuesta original si el componente la necesita.
            conflictError.response = error.response; 
            throw conflictError;
            
        } else if (error.response) {
            // Error HTTP no 409 (ej. 404, 500), lanzar el error original de axios
            throw error;
        } else {
            // Error de red, configuración, etc.
            throw error; 
        }
    }
};
