import axios from "axios";
import { ENDPOINTS } from "./apiConfig";

/**
 * Obtiene el token desde localStorage
 * @returns {string|null}
 */
const getAuthToken = () => {
  const token = localStorage.getItem("userToken");
  if (!token) {
    console.warn("Token no encontrado en localStorage");
    return null;
  }
  return token;
};

/**
 * Configuración de headers con token
 */
const getAuthConfig = () => {
  const token = getAuthToken();
  if (!token) throw new Error("No autorizado. Inicia sesión.");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ Obtener todos los pedidos (admin)
export const getPedidos = async () => {
  try {
    const { data } = await axios.get(ENDPOINTS.PEDIDOS.GET_ALL, getAuthConfig());
    return data;
  } catch (error) {
    console.error("Error al obtener pedidos:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Crear un nuevo pedido
export const createPedido = async (pedido) => {
  try {
    const { data } = await axios.post(ENDPOINTS.PEDIDOS.CREATE, pedido, getAuthConfig());
    return data;
  } catch (error) {
    console.error("Error al crear pedido:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Obtener detalle completo de un pedido por ID
export const getPedidoById = async (id) => {
  try {
    const { data } = await axios.get(ENDPOINTS.PEDIDOS.GET_BY_ID(id), getAuthConfig());
    return data;
  } catch (error) {
    console.error("Error al obtener detalle del pedido:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Editar/actualizar un pedido completo
export const updatePedido = async (id, pedidoActualizado) => {
  try {
    const { data } = await axios.put(
      ENDPOINTS.PEDIDOS.UPDATE(id),
      pedidoActualizado,
      getAuthConfig()
    );
    return data;
  } catch (error) {
    console.error("Error al actualizar pedido:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Obtener pedidos de un cliente específico
export const getPedidosByCliente = async (idUsuario) => {
  try {
    const { data } = await axios.get(
      ENDPOINTS.PEDIDOS.GET_BY_CLIENTE(idUsuario),
      getAuthConfig()
    );
    return data;
  } catch (error) {
    console.error("Error al obtener pedidos del cliente:", error.response?.data || error.message);
    throw error;
  }
};

// 🗑️ Eliminar pedido
export const deletePedido = async (id) => {
  try {
    const { data } = await axios.delete(ENDPOINTS.PEDIDOS.DELETE(id), getAuthConfig());
    return data;
  } catch (error) {
    console.error("Error al eliminar pedido:", error.response?.data || error.message);
    throw error;
  }
};
