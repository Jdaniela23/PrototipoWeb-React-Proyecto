import axios from 'axios';
import { ENDPOINTS } from './apiConfig';

/**
 * Obtiene el token de autenticación del almacenamiento local.
 * @returns {string | null} El token de autenticación o null si no se encuentra.
 */
const getAuthToken = () => {
    const token = localStorage.getItem('userToken');

    if (!token) {
        console.warn("Advertencia: No se encontró el token de autenticación para usersService.");
        return null;
    }
    return token;
};

// FUNCIONES DEL SERVICIO DE USUARIOS (ADMIN)
/**
 * Obtiene la lista completa de usuarios del sistema (función para el Admin).
 * @returns {Promise<Array<Object>>} Promesa que resuelve con el array de usuarios.
 * @throws {Error} Si no hay token o si la llamada a la API falla.
 */
export const getAllUsers = async () => {
    const authToken = getAuthToken();

    if (!authToken) {
        throw new Error("No autorizado. Tu sesión ha expirado o no tienes permisos.");
    }

    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        };

        const response = await axios.get(ENDPOINTS.USUARIOS.LISTAR, config);
        return response.data;
    } catch (error) {
        const errorMessage = error.response
            ? error.response.data.message || error.response.data.title || JSON.stringify(error.response.data)
            : error.message;

        console.error("Error al obtener la lista de usuarios:", errorMessage);

        if (error.response && error.response.status === 401) {
            throw new Error("No autorizado. No tienes permisos de administrador.");
        }

        throw new Error(errorMessage || "Error desconocido al obtener usuarios.");
    }
};

/**
 * @param {FormData} formData - Objeto FormData con los datos del nuevo usuario, incluyendo la foto (File).
 * @returns {Promise<Object>} 
 * @throws {Error} 
 */
export const createNewUser = async (formData) => {
    const authToken = getAuthToken();

    if (!authToken) {
        throw new Error("No autorizado. Token no encontrado.");
    }

    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            }
        };

        const response = await axios.post(ENDPOINTS.USUARIOS.LISTAR, formData, config); 

        return response.data;

    } catch (error) {
        const errorResponse = error.response;
        const errorMessage = errorResponse?.data?.title || errorResponse?.data?.message || JSON.stringify(errorResponse?.data) || error.message;

        console.error("Error al crear nuevo usuario:", errorMessage);

        if (errorResponse && errorResponse.status === 401) {
            throw new Error("No autorizado. No tienes permisos para crear usuarios.");
        }

        throw new Error(errorMessage || "Error desconocido al crear el usuario.");
    }
};

/**
 * @param {number} userId - ID del usuario a editar.
 * @param {Object} userData 
 * @returns {Promise<Object>} 
 * @throws {Error}
 */
export const updateUserAdmin = async (userId, userData) => {
    const authToken = getAuthToken();

    if (!authToken) {
        throw new Error("No autorizado. Tu sesión ha expirado o no tienes permisos.");
    }

    if (!userId) {
        throw new Error("El ID del usuario es requerido para la actualización.");
    }
    const payload = userData;
    const url = ENDPOINTS.USUARIOS.DETALLE(userId);

    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        };
        const response = await axios.put(url, payload, config);

        return response.data;

    } catch (error) {
        const errorResponse = error.response;
        const errorMessage = errorResponse?.data?.title || errorResponse?.data?.message || JSON.stringify(errorResponse?.data) || error.message;

        console.error(`Error al actualizar el usuario ID ${userId}:`, errorMessage);

        if (errorResponse && errorResponse.status === 401) {
            throw new Error("No autorizado. No tienes permisos de administrador para editar.");
        }

        throw new Error(errorMessage || "Error desconocido al actualizar el usuario.");
    }
};

/**
 * @param {number} userId 
 * @returns {Promise<Object>} 
 * @throws {Error} 
 */
export const deleteUser = async (userId) => {
    const authToken = getAuthToken();

    if (!authToken) {
        throw new Error("No autorizado. Tu sesión ha expirado o no tienes permisos.");
    }

    if (!userId) {
        throw new Error("El ID del usuario es requerido para la eliminación.");
    }

    // Usamos la función ELIMINAR definida en apiConfig
    const url = ENDPOINTS.USUARIOS.ELIMINAR(userId);

    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        };

        const response = await axios.delete(url, config);

        return response.data;

    } catch (error) {
        const errorResponse = error.response;
        const errorMessage = errorResponse?.data?.title || errorResponse?.data?.message || JSON.stringify(errorResponse?.data) || error.message;

        console.error(`Error al eliminar el usuario ID ${userId}:`, errorMessage);

        if (errorResponse && errorResponse.status === 401) {
            throw new Error("No autorizado. No tienes permisos de administrador para eliminar.");
        }

        throw new Error(errorMessage || "Error desconocido al eliminar el usuario.");
    }
};

//Función para el cambio de estado swicht
export const toggleUserState = async (userId, nuevoEstado) => {
    const authToken = getAuthToken();

    if (!authToken) {
        throw new Error("No autorizado. Tu sesión ha expirado o no tienes permisos.");
    }

    if (!userId) {
        throw new Error("El ID del usuario es requerido.");
    }

    // Usamos la función CAMBIAR_ESTADO definida en apiConfig
    const baseUrl = ENDPOINTS.USUARIOS.CAMBIAR_ESTADO(userId);


    // http://192.168.1.7:5282/api/Usuarios/CambiarEstado/37?activo=false
    const url = `${baseUrl}?activo=${nuevoEstado}`;

    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        };

        const response = await axios.put(url, null, config);

        return response.data;

    } catch (error) {
        const errorResponse = error.response;
        
        const rawErrorMessage = errorResponse?.data?.message || errorResponse?.data?.title || JSON.stringify(errorResponse?.data) || error.message;

        let errorMessage = String(rawErrorMessage);
        
        errorMessage = errorMessage.replace(/^"|"$/g, ''); 
        
        console.error(`Error al cambiar el estado del usuario ID ${userId}:`, errorMessage);

        if (errorResponse && errorResponse.status === 401) {
            throw new Error("No autorizado. No tienes permisos de administrador para editar.");
        }

        throw new Error(errorMessage || "Error desconocido al cambiar el estado del usuario.");
    }
};

export const updateUser = async (userId, profileData) => {
    const token = localStorage.getItem('userToken');

    if (!token) {
        throw new Error('No se encontró un token. Por favor, inicia sesión.');
    }

    if (!userId) {
        throw new Error('El ID de usuario es necesario para actualizar.');
    }

    try {

        const url = ENDPOINTS.USUARIOS.DETALLE(userId); 

        const response = await fetch(url, {
            method: 'PUT',

            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: profileData,
        });

        const text = await response.text();

        if (!response.ok) {

            const status = response.status;
            const message = text || response.statusText;
            throw new Error(`Fallo al actualizar el usuario: Error de Servidor (${status}). Detalles: ${message}`);
        }

        return text ? JSON.parse(text) : { success: true };
    } catch (error) {

        throw error;
    }
};