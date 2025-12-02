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

/*  Obtener todas las tallas */
export const getTallas = async () => {
  try {
    const response = await axios.get(ENDPOINTS.TALLAS.GET_ALL, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener las tallas:", error.response?.data || error.message);
    throw error;
  }
};

/* Obtener una talla por ID */
export const getTallaById = async (id) => {
  try {
    const response = await axios.get(ENDPOINTS.TALLAS.GET_BY_ID(id), {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la talla ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

/* Crear talla */
export const createTalla = async (data) => {
  try {
    const response = await axios.post(ENDPOINTS.TALLAS.CREATE, data, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear la talla:", error.response?.data || error.message);
    throw error;
  }
};

/* Actualizar talla */
export const updateTalla = async (id, data) => {
  try {
    const response = await axios.put(ENDPOINTS.TALLAS.UPDATE(id), data, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la talla ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

/* Eliminar talla */
export const deleteTalla = async (id) => {
  try {
    const response = await axios.delete(ENDPOINTS.TALLAS.DELETE(id), {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error(`Error al eliminar la talla ${id}:`, errorMessage);
    
    throw error;
  }
};
