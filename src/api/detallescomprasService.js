import { ENDPOINTS } from "./apiConfig.js";

const defaultHeaders = {
    "Content-Type": "application/json",
};

const getAuthToken = () => {
    const token = localStorage.getItem('userToken');

    if (!token) {
        console.warn("Advertencia: No se encontró el token de autenticación para detalles de compras. Podría resultar en 401.");
    }
    return token;
};

const getConfig = (options = {}) => {
    const authToken = getAuthToken();
    
    return {
        ...options,
        // Fusionar los headers default, el de autorización y los headers específicos de options
        headers: {
            ...defaultHeaders,
            ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
            ...(options.headers || {})
        },
    };
};

// -------------------------------------------------------------------------

// Obtener todos los detalles de compras
export const getDetalleCompras = async () => {
    const config = getConfig(); // ⬅️ OBTENER LA CONFIGURACIÓN CON EL TOKEN

    try {
        // ⬅️ USAR LA CONFIGURACIÓN
        const response = await fetch(ENDPOINTS.DETALLECOMPRAS.GET_ALL, config); 
        
        // Manejo de errores incluyendo el 401
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Acceso no autorizado. Por favor inicie sesión.");
            }
            const errorText = await response.text(); 
            throw new Error(`Error al obtener los detalles de compras: ${response.status} - ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en getDetalleCompras:", error);
        throw error;
    }
};

// Crear un detalle de compra
export const createDetalleCompra = async (detalleCompra) => {
    // ⬅️ CREAR CONFIGURACIÓN para POST (incluye body y método)
    const config = getConfig({
        method: "POST",
        body: JSON.stringify(detalleCompra),
    });

    try {
        console.log("📤 Enviando detalle compra:", detalleCompra);
        
        // ⬅️ USAR LA CONFIGURACIÓN
        const response = await fetch(ENDPOINTS.DETALLECOMPRAS.CREATE, config);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Error response detalle:", errorText);
             if (response.status === 401) {
                throw new Error("No autorizado para crear. Verifique su token.");
            }
            throw new Error(`Error al crear detalle de compra: ${response.status} - ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en createDetalleCompra:", error);
        throw error;
    }
};

// Actualizar un detalle de compra
export const updateDetalleCompra = async (id, detalleCompra) => {
     // ⬅️ CREAR CONFIGURACIÓN para PUT
    const config = getConfig({
        method: "PUT",
        body: JSON.stringify(detalleCompra),
    });

    try {
        // ⬅️ USAR LA CONFIGURACIÓN
        const response = await fetch(`${ENDPOINTS.DETALLECOMPRAS.UPDATE}/${id}`, config);

        if (!response.ok) {
             if (response.status === 401) {
                throw new Error("No autorizado para actualizar. Verifique su token.");
            }
            throw new Error("Error al actualizar detalle de compra");
        }

        return await response.json();
    } catch (error) {
        console.error("Error en updateDetalleCompra:", error);
        throw error;
    }
};

// Eliminar un detalle de compra
export const deleteDetalleCompra = async (id) => {
    // ⬅️ CREAR CONFIGURACIÓN para DELETE
    const config = getConfig({
        method: "DELETE",
    });

    try {
        // ⬅️ USAR LA CONFIGURACIÓN
        const response = await fetch(`${ENDPOINTS.DETALLECOMPRAS.DELETE}/${id}`, config);

        if (!response.ok) {
             if (response.status === 401) {
                throw new Error("No autorizado para eliminar. Verifique su token.");
            }
            throw new Error("Error al eliminar detalle de compra");
        }

        // Si la eliminación es exitosa (200 o 204), retornamos true
        return true; 
    } catch (error) {
        console.error("Error en deleteDetalleCompra:", error);
        throw error;
    }
};

export default {
    getDetalleCompras,
    createDetalleCompra,
    updateDetalleCompra,
    deleteDetalleCompra
};