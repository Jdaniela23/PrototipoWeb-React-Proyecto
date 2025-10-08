import { ENDPOINTS } from "./apiConfig.js";

// Configuración común para las peticiones
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
        console.warn("Advertencia: No se encontró el token de autenticación para proveedores. Podría resultar en 401.");
    }
    return token;
};

// Función auxiliar para manejar respuestas HTTP - ¡CORREGIDA!
const handleResponse = async (response) => {
    // 💡 CLONAR la respuesta para poder leer el cuerpo (JSON/TEXTO) en caso de error
    const clonedResponse = response.clone();
    
    if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        
        try {
            // Intenta leer el JSON del CLON para obtener detalles del error
            const errorData = await clonedResponse.json();
            errorMessage = `Error ${response.status}: ${JSON.stringify(errorData)}`;
        } catch {
            // Si no se puede parsear como JSON, usar texto plano del CLON
            const errorText = await clonedResponse.text();
            if (errorText) {
                errorMessage = `Error ${response.status}: ${errorText}`;
            }
        }
        
        throw new Error(errorMessage);
    }

    // Para respuestas sin contenido (204 No Content)
    if (response.status === 204) {
        return null;
    }

    // Retornar el JSON de la respuesta ORIGINAL
    return await response.json();
};

// Función para hacer peticiones fetch con configuración común - ¡CORREGIDA!
const fetchWithConfig = async (url, options = {}) => {
    const authToken = getAuthToken(); // Obtener el token
    
    const config = {
        ...options,
        // 🔑 AGREGAR LA CABECERA DE AUTORIZACIÓN (si el token existe)
        headers: {
            ...defaultHeaders,
            ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
            // Asegurar que las cabeceras pasadas en 'options' sobrescriban o se incluyan
            ...(options.headers || {})
        },
    };

    console.log(`🌐 ${config.method || 'GET'} a: ${url}`);
    // No mostrar el cuerpo en GET, DELETE, HEAD
    if (config.body && config.method !== 'GET' && config.method !== 'DELETE') { 
        console.log("📤 Datos enviados:", JSON.parse(config.body));
    }

    try {
        const response = await fetch(url, config);
        return await handleResponse(response);
    } catch (error) {
        console.error(`❌ Error en petición a ${url}:`, error);
        throw error;
    }
};

// Obtener todos los proveedores
export const getProveedores = async () => {
    return await fetchWithConfig(ENDPOINTS.PROVEEDORES.GET_ALL);
};

// Obtener un proveedor por ID
export const getProveedorById = async (id) => {
    if (!id) {
        throw new Error("ID de proveedor es requerido");
    }
    
    const url = `${ENDPOINTS.PROVEEDORES.GET_ALL}/${id}`;
    return await fetchWithConfig(url);
};

// Crear un proveedor
export const createProveedor = async (proveedorData) => {
    if (!proveedorData) {
        throw new Error("Datos del proveedor son requeridos");
    }

    // Validación básica de datos requeridos
    const requiredFields = ['nombre', 'telefono', 'email'];
    const missingFields = requiredFields.filter(field => !proveedorData[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
    }

    return await fetchWithConfig(ENDPOINTS.PROVEEDORES.CREATE, {
        method: "POST",
        body: JSON.stringify(proveedorData),
    });
};

// Editar un proveedor
export const updateProveedor = async (id, proveedorData) => {
    if (!id) {
        throw new Error("ID de proveedor es requerido");
    }
    
    if (!proveedorData) {
        throw new Error("Datos del proveedor son requeridos");
    }

    const url = `${ENDPOINTS.PROVEEDORES.GET_ALL}/${id}`;
    console.log("🔗 URL de actualización:", url);
    
    // PREPARAR DATOS CON EL FORMATO QUE ESPERA EL BACKEND
    const datosParaBackend = {
        ...proveedorData,
        idProveedor: parseInt(id)
    };
    
    console.log("📤 Datos formateados para backend:", datosParaBackend);

    return await fetchWithConfig(url, {
        method: "PUT",
        body: JSON.stringify(datosParaBackend),
    });
};

// Cambiar estado del proveedor (activar/inactivar)
export const toggleEstadoProveedor = async (proveedor) => {
    if (!proveedor || !proveedor.idProveedor) {
        throw new Error("Proveedor válido con ID es requerido");
    }

    try {
        const proveedorActualizado = {
            ...proveedor,
            estado: !proveedor.estado,
        };

        const result = await updateProveedor(proveedor.idProveedor, proveedorActualizado);
        
        return {
            success: true,
            data: result,
            message: `Proveedor ${proveedorActualizado.estado ? 'activado' : 'inactivado'} correctamente`,
            nuevoEstado: proveedorActualizado.estado
        };
        
    } catch (error) {
        console.error("❌ proveedoresService.toggleEstadoProveedor:", error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Eliminar un proveedor
export const deleteProveedor = async (id) => {
    if (!id) {
        throw new Error("ID de proveedor es requerido");
    }

    const url = `${ENDPOINTS.PROVEEDORES.GET_ALL}/${id}`;
    
    return await fetchWithConfig(url, {
        method: "DELETE",
    });
};

// Validar datos del proveedor antes de enviar
export const validateProveedorData = (proveedorData) => {
    const errors = {};

    if (!proveedorData.nombre?.trim()) {
        errors.nombre = "El nombre es requerido";
    }

    if (!proveedorData.telefono?.trim()) {
        errors.telefono = "El teléfono es requerido";
    }

    if (!proveedorData.email?.trim()) {
        errors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(proveedorData.email)) {
        errors.email = "El formato del email es inválido";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Función de diagnóstico
export const diagnosticarProveedor = async (id) => {
    try {
        console.log("🔍 Iniciando diagnóstico para proveedor ID:", id);
        
        // 1. Primero obtener el proveedor actual
        const proveedorActual = await getProveedorById(id);
        console.log("📋 Proveedor actual:", proveedorActual);
        
        // 2. Verificar la estructura esperada
        const estructuraEsperada = {
            idProveedor: proveedorActual.idProveedor,
            nombre: proveedorActual.nombre,
            telefono: proveedorActual.telefono,
            email: proveedorActual.email,
            direccion: proveedorActual.direccion,
            ciudad: proveedorActual.ciudad,
            estado: proveedorActual.estado
        };
        
        console.log("🎯 Estructura que deberíamos enviar:", estructuraEsperada);
        
        return estructuraEsperada;
    } catch (error) {
        console.error("❌ Error en diagnóstico:", error);
        throw error;
    }
};

export default {
    getProveedores,
    getProveedorById,
    createProveedor,
    updateProveedor,
    toggleEstadoProveedor,
    deleteProveedor,
    validateProveedorData,
    diagnosticarProveedor
};