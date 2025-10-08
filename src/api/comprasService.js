import { ENDPOINTS } from "./apiConfig.js";

// 🔑 Configuración de cabeceras con Content-Type por defecto
const defaultHeaders = {
    "Content-Type": "application/json",
};

/**
 * Obtiene el token de autenticación del almacenamiento local.
 * @returns {string | null} El token de autenticación o null si no se encuentra.
 */
const getAuthToken = () => {
    const token = localStorage.getItem('userToken');

    if (!token) {
        console.warn("Advertencia: No se encontró el token de autenticación para compras. Podría resultar en 401.");
    }
    return token;
};

/**
 * Función auxiliar para crear la configuración de fetch con el token incluido.
 * @param {Object} options Opciones de fetch adicionales.
 * @returns {Object} Configuración completa de fetch.
 */
const getConfig = (options = {}) => {
    const authToken = getAuthToken();
    
    return {
        ...options,
        headers: {
            ...defaultHeaders,
            // 🔑 Incluir el header de Autorización si el token existe
            ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
            ...(options.headers || {})
        },
    };
};

// --------------------------------------------------------------------------------------------------

// Obtener todas las compras
export const getCompras = async () => {
    const config = getConfig(); // Obtener configuración con token

    try {
        const response = await fetch(ENDPOINTS.COMPRAS.GET_ALL, config); // Usar la configuración
        
        // 🚨 Manejo mejorado del 401 (similar a proveedoresService)
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Acceso no autorizado. Por favor inicie sesión.");
            }
            throw new Error(`Error al obtener compras: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ comprasService.getCompras:", error);
        throw error;
    }
};

// 🆕 Obtener una compra por ID
export const getCompraById = async (id) => {
    if (!id) {
        throw new Error("ID de compra es requerido");
    }

    // Nota: Es más común que la URL para obtener detalles sea GET_ALL/ID, no CREATE/ID
    const url = `${ENDPOINTS.COMPRAS.GET_ALL}/${id}`;
    const config = getConfig();

    try {
        console.log("🔍 Obteniendo compra por ID:", id);
        
        const response = await fetch(url, config); // Usar la configuración

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Acceso no autorizado. Por favor inicie sesión.");
            }
            throw new Error(`Error al obtener compra: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Compra obtenida:", data);
        return data;
        
    } catch (error) {
        console.error("❌ comprasService.getCompraById:", error);
        throw error;
    }
};

// Crear una compra
export const createCompras = async (compraData) => {
    // 🔑 Generar la configuración con el método POST y el cuerpo
    const config = getConfig({
        method: "POST",
        body: JSON.stringify(compraData),
    });

    try {
        console.log("📤 Enviando datos al backend:", compraData);
        
        const response = await fetch(ENDPOINTS.COMPRAS.CREATE, config);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Error response:", errorText);
            
            if (response.status === 401) {
                throw new Error("No autorizado para crear compra. Verifique su token.");
            }
            throw new Error(`Error al crear compra: ${response.status} - ${errorText}`);
        }

        // Si el backend devuelve 204 (No Content) o 200 (OK)
        // Usar response.json() si se espera un cuerpo de respuesta
        return await response.json(); 
    } catch (error) {
        console.error("❌ comprasService.createCompra:", error);
        throw error;
    }
};

// Editar una compra
export const updateCompras = async (id, compraData) => {
    // 🔑 Generar la configuración con el método PUT y el cuerpo
    const config = getConfig({
        method: "PUT",
        body: JSON.stringify(compraData),
    });

    try {
        const response = await fetch(`${ENDPOINTS.COMPRAS.CREATE}/${id}`, config); // Usar la configuración

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("No autorizado para editar compra. Verifique su token.");
            }
            throw new Error("Error al editar compra");
        }

        return await response.json();
    } catch (error) {
        console.error("❌ comprasService.updateCompra:", error);
        throw error;
    }
};

// Anular compra
export const anularCompra = async (compra) => {
    const compraAnuladaDto = {
        IdCompra: compra.id_Compra,
        Estado: "Anulado"
    };

    // 🔑 Generar la configuración con el método PUT y el cuerpo
    const config = getConfig({
        method: "PUT",
        body: JSON.stringify(compraAnuladaDto),
    });

    try {
        console.log("📤 Enviando DTO al backend:", compraAnuladaDto);

        const response = await fetch(`${ENDPOINTS.COMPRAS.CREATE}/${compra.id_Compra}`, config); // Usar la configuración

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Error response:", errorText);
            
            if (response.status === 401) {
                throw new Error("No autorizado para anular compra. Verifique su token.");
            }
            throw new Error(`Error al anular la compra: ${response.status} - ${errorText}`);
        }

        const result = await response.json();

        return {
            success: true,
            data: result,
            message: "✅ Compra anulada correctamente",
        };
        
    } catch (error) {
        console.error("❌ comprasService.anularCompra:", error);
        return {
            success: false,
            error: error.message,
        };
    }
};

export default {
    getCompras,
    getCompraById,
    createCompras,
    updateCompras,
    anularCompra,
    // Puedes añadir más funciones aquí si es necesario
};