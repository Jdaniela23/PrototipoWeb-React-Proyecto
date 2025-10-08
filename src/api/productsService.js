import axios from 'axios';
import { ENDPOINTS } from './apiConfig'; 


/**
 * Obtener todos los productos (sin detalles completos)
 */
export const getProducts = async () => {
    try {
        const response = await axios.get(ENDPOINTS.PRODUCTS.GET_ALL);
        
        // La lógica de asignar imágenes locales temporales debe mantenerse aquí si ENDPOINTS.PRODUCTS.GET_ALL 
        // no te devuelve el DTO completo con imágenes.
        return response.data; // Aquí va la data, ajusta si mantienes el mapeo de imágenes temporales.
    } catch (error) {
        console.error("Error al obtener los productos:", error.response?.data || error.message);
        throw error; 
    }
};

/**
 * Obtener un producto por ID con todos sus detalles e imágenes
 */
export const getProductById = async (id) => {
    try {
        // Llama al endpoint que devuelve el ProductoDto completo con Includes
        const response = await axios.get(ENDPOINTS.PRODUCTS.GET_BY_ID(id)); 
        return response.data;
    } catch (error) {
        console.error(`Error al obtener el producto ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

/**
 * Obtiene el token de autenticación desde localStorage
 * @returns {string|null}
 */
const getAuthToken = () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        console.warn("Token no encontrado en localStorage");
        return null;
    }
    return token;
};

/**
 * Crea un nuevo producto (solo admin)
 * @param {FormData} formData
 */
export const createProduct = async (formData) => {
    const authToken = getAuthToken();
    if (!authToken) throw new Error("No autorizado. Inicia sesión como administrador.");

    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                // NO pongas Content-Type, axios lo calcula automáticamente para FormData
            }
        };

        const response = await axios.post(ENDPOINTS.PRODUCTS.CREATE, formData, config);
        return response.data;

    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data?.title || error.message;
        console.error("Error al crear el producto:", errorMessage);

        if (error.response?.status === 401) {
            throw new Error("No autorizado. Tu sesión ha expirado o no tienes permisos de administrador.");
        }

        throw new Error(errorMessage || "Error desconocido al crear el producto.");
    }
};

/**
 * Editar un producto existente (requiere FormData para los archivos y gestión de IDs)
 * @param {number} id - ID del producto a editar.
 * @param {FormData} formData - Datos del producto y detalles, incluyendo archivos.
 */
export const updateProduct = async (id, formData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Token no encontrado en localStorage");
    }

    const response = await axios.put(ENDPOINTS.PRODUCTS.UPDATE(id), formData, {
      headers: {
        "Authorization": `Bearer ${token}`, // ✅ Envía el token
        "Content-Type": "multipart/form-data", // ✅ Requerido para FormData
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error al editar el producto ${id}:`, error.response?.data || error.message);
    throw error;
  }
};


export const changeProductState = async (id, nuevoEstado) => {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) throw new Error("No autorizado.");

        const response = await axios.put(
            ENDPOINTS.PRODUCTS.CHANGE_STATE(id),
            nuevoEstado, // enviar true o false directo
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error(`Error al cambiar el estado del producto ${id}:`, error.response?.data || error.message);
        throw error;
    }
};




export const deleteProduct = async (id) => {
    const token = localStorage.getItem('userToken');
    if (!token) throw new Error("No autorizado. Inicia sesión como administrador.");

    try {
        const response = await axios.delete(ENDPOINTS.PRODUCTS.DELETE(id), {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar el producto ${id}:`, error.response?.data || error.message);
        throw error;
    }
}

/*Obtener categorías */
export const getCategorias = async () => {
  try {
    const response = await axios.get(ENDPOINTS.PRODUCTS.GET_CATEGORIAS);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las categorías:", error.response?.data || error.message);
    throw error;
  }
};


/**
 * Obtener todos los productos (solo admin)
 */
export const getProductsAdmin = async () => {
    try {
        const token = localStorage.getItem('userToken');
        if (!token) throw new Error("No autorizado. Inicia sesión como administrador.");

        const response = await axios.get(ENDPOINTS.PRODUCTS.GET_ADMIN, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // 🔹 Asegurarse que siempre sea un array
        if (Array.isArray(response.data)) {
            return response.data;
        } else if (response.data && Array.isArray(response.data.productos)) {
            return response.data.productos;
        } else {
            console.warn("getProductsAdmin: respuesta inesperada, se retorna array vacío", response.data);
            return [];
        }

    } catch (error) {
        console.error("Error al obtener productos admin:", error.response?.data || error.message);
        throw error;
    }
};
