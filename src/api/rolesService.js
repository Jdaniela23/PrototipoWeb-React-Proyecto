import axios from 'axios';
import { ENDPOINTS } from './apiConfig';

/* Constantes para definir el estado de un rol: (1 para ACTIVO, 0 para INACTIVO).*/
export const ESTADO_ROL = {
    ACTIVO: 1,
    INACTIVO: 0,
};

/*
 * Obtiene el token de autenticación del almacenamiento local.
 * @returns {string | null} El token de autenticación o null si no se encuentra.
*/
const getAuthToken = () => {
    const token = localStorage.getItem('userToken');

    if (!token) {
        console.warn("Advertencia: No se encontró el token de autenticación. Posiblemente el usuario no ha iniciado sesión.");
        return null;
    }
    return token;
};

/**
 * Obtiene la lista completa de roles del sistema.
 * @returns {Promise<Array<Object>>} Promesa que resuelve con el array de roles.
 * @throws {Error} Si no hay token de autenticación o si la llamada a la API falla. */
/**
 * Obtiene la lista completa de roles desde la API.
 * @returns {Promise<Array<{id: number, nombre_Rol: string}>>} Lista de roles.
 */
export const getRoles = async () => {
    const authToken = getAuthToken();
    
    // Si no hay token, no intentes hacer la llamada a la API
    if (!authToken) {
        throw new Error("No autorizado. Tu sesión ha expirado o no tienes permisos.");
    }

    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        };

        const response = await axios.get(ENDPOINTS.ROLES.GET_ALL, config);
        
        return response.data;
    } catch (error) {
        console.error("Error al obtener los roles:", error.response ? error.response.data : error.message);
        
        if (error.response && error.response.status === 401) {
            throw new Error("No autorizado. Tu sesión ha expirado o no tienes permisos.");
        }
        
        throw error;
    }
};

/**
 * Actualiza un rol existente con la información proporcionada, incluyendo la lista de permisos.
 * @param {Object} rolData - Objeto con los datos actualizados del rol. 
 * Debe incluir Id_Rol, Nombre_Rol, Descripcion_Rol, Estado_Rol y Permisos.
 * @returns {Promise<Object>} Promesa que resuelve con los datos de la respuesta (usualmente vacío en PUT/204).
 * @throws {Error} Si no hay token, no hay permisos, o falla la actualización.
 */
export const updateRol = async (rolData) => {
    const authToken = getAuthToken();
    
    if (!authToken) {
        throw new Error("No autorizado. Tu sesión ha expirado o no tienes permisos.");
    }
    
    // 🚨 PASO CLAVE: Usamos las propiedades exactas (PascalCase) que vienen de React, 
    // y asumimos que React ya las ha mapeado correctamente (como vimos en el console.log).
    // React envía: { Id_Rol: 16, Nombre_Rol: 'Gerente', ..., Permisos: [...] }
    
    const rolId = rolData.Id_Rol; // 👈 OBTENER ID CORRECTAMENTE
    
    if (!rolId) {
        throw new Error("El ID del rol (Id_Rol) es requerido para la actualización.");
    }

    // 🟢 PAYLOAD FINAL: Envía el objeto tal cual lo construiste en EditRol.jsx 
    // y que ya coincide con UpdateRolDto.
    const payload = rolData; 
    
    // La API espera el ID del rol en la URL
    // 🚨 CORRECCIÓN: Usar el ID correcto (rolId) que ahora sí se obtiene de rolData.Id_Rol
    const url = ENDPOINTS.ROLES.DETALLE_O_ACCION(rolId); 
    
    // 🟢 DEPURACIÓN: Verifica la URL antes de enviar
    console.log(`[PUT] URL de actualización: ${url}`);
    
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
        const errorMessage = error.response 
            ? error.response.data.title || error.response.data.message || JSON.stringify(error.response.data)
            : error.message;
        
        console.error(`Error al actualizar el rol ID ${rolId}:`, errorMessage);
        
        if (error.response && error.response.status === 401) {
             throw new Error("No autorizado. Tu sesión ha expirado o no tienes permisos para actualizar.");
        }
        
        // El error de validación (400) se propagará con el mensaje detallado si existe.
        throw new Error(errorMessage || "Error desconocido al actualizar el rol.");
    }
};

/**
 * Obtiene la lista de todos los nombres de permisos disponibles para asignar a los roles.
 * @returns {Promise<Array<string>>} Promesa que resuelve con un array de nombres de permisos.
 * @throws {Error} Si no hay token de autenticación o si la llamada a la API falla.
 */
export const fetchAllPermisos = async () => {
    const authToken = getAuthToken();
    if (!authToken) {
        throw new Error("No autorizado. Token no encontrado.");
    }

    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        };

        const response = await axios.get(ENDPOINTS.ROLES.GET_PERMISOS, config);
        // Esperamos que la API devuelva un array de strings (ej: ["Gestión de Usuarios", ...])
        return response.data; 
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al obtener la lista de permisos disponibles.';
        console.error("Error en fetchAllPermisos:", errorMessage);
        throw new Error(errorMessage);
    }
};

/**
 * Crea un nuevo rol en el sistema.
 * @param {Object} roleData - Datos del nuevo rol (nombreRol, descripcionRol, estadoRol, permisos).
 * @returns {Promise<Object>} Promesa que resuelve con los datos de respuesta de la creación.
 * @throws {Error} Si no hay token, no hay permisos, o falla la creación.
*/
export const createNewRole = async (roleData) => {
    const authToken = getAuthToken();
    if (!authToken) {
        throw new Error("No autorizado. Token no encontrado.");
    }
    
    // ⭐ Mapeo de camelCase (frontend) A PascalCase (backend C# DTO) y Asignación de Estado por Defecto ⭐
    
    // Aseguramos que el estado sea un número entero (1 por defecto si no se especifica)
    const estadoRolValue = roleData.estadoRol !== undefined 
        ? roleData.estadoRol
        : ESTADO_ROL.ACTIVO; // Por defecto es 1 (Activo)

    const payload = {
        Nombre_Rol: roleData.nombreRol,
        Descripcion_Rol: roleData.descripcionRol,
        Estado_Rol: estadoRolValue, // Se envía el valor numérico (1 o 0)
        Permisos: roleData.permisos || [], 
    };

    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json' 
            }
        };

        const response = await axios.post(ENDPOINTS.ROLES.CREATE, payload, config);
        
        return response.data; 
        
    } catch (error) {
        // --- Manejo Mejorado del Error 400 de Validación ---
        const errorResponse = error.response;
        
        if (errorResponse && errorResponse.status === 400 && errorResponse.data.errors) {
            // Error de validación de modelo (Model Validation Error)
            console.error("Error de Validación (400) en createNewRole:", errorResponse.data.errors);
            
            // Creamos un mensaje detallado a partir del objeto 'errors'
            let validationMessages = [];
            for (const field in errorResponse.data.errors) {
                const messages = errorResponse.data.errors[field];
                if (Array.isArray(messages)) {
                    validationMessages.push(`[${field}]: ${messages.join(' | ')}`);
                }
            }
            
            // Lanzamos un error que contenga los detalles específicos
            const finalMessage = validationMessages.length > 0 
                ? `Error de Validación de API: ${validationMessages.join(' -- ')}`
                : errorResponse.data.title || 'Error de Validación de datos desconocido.';
                
            throw new Error(finalMessage);
        } 
        
        // Manejo de otros errores (409 Conflicto, 401 No Autorizado, Red)
        const errorMessage = errorResponse?.data?.message || errorResponse?.data || error.message || 'Error desconocido al crear el rol.';
        console.error("Error general en createNewRole:", errorMessage);
        
        if (errorResponse && errorResponse.status === 409) {
            throw new Error(`Conflicto: El rol ya existe. ${errorMessage}`);
        }
        
        throw new Error(errorMessage);
    }
};

export const deleteRol = async (rolId) => {
    const authToken = getAuthToken();
    
    if (!authToken) {
        throw new Error("No autorizado. Tu sesión ha expirado o no tienes permisos.");
    }
    
    if (!rolId) {
        throw new Error("El ID del rol es requerido para la eliminación.");
    }


    const url = ENDPOINTS.ROLES.DETALLE_O_ACCION(rolId); 

    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        };


        const response = await axios.delete(url, config);
        
        // Si el backend devuelve 204 (No Content) o 200 (OK), la eliminación fue exitosa.
        return response.data; 
        
    } catch (error) {
        const errorResponse = error.response;
        const errorMessage = errorResponse 
            ? errorResponse.data.title || errorResponse.data.message || JSON.stringify(errorResponse.data)
            : error.message;
            
        console.error(`Error al eliminar el rol ID ${rolId}:`, errorMessage);
        
        if (errorResponse && errorResponse.status === 401) {
             throw new Error("No autorizado. Tu sesión ha expirado o no tienes permisos para eliminar.");
        }
        
        throw new Error(`Error de API: ${errorMessage}` || "Error desconocido al eliminar el rol.");
    }
};