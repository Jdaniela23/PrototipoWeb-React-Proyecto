import axios from "axios";
import { ENDPOINTS } from "./apiConfig";

// 🔹 Función para obtener token desde localStorage
const getAuthToken = () => {
  const token = localStorage.getItem("userToken");
  if (!token) {
    console.warn("Token no encontrado en localStorage");
    return null;
  }
  return token;
};

// 🔹 Configuración de headers con token
const getAuthConfig = () => {
  const token = getAuthToken();
  if (!token) throw new Error("No autorizado. Inicia sesión.");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// 🔹 Obtener todas las categorías
export const getCategorias = async () => {
  try {
    const { data } = await axios.get(ENDPOINTS.CATEGORIAS.GET_ALL, getAuthConfig());
    return data;
  } catch (error) {
    console.error("Error al obtener categorías:", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 Obtener una categoría por ID
export const getCategoriaById = async (id) => {
  try {
    const { data } = await axios.get(ENDPOINTS.CATEGORIAS.GET_BY_ID(id), getAuthConfig());
    return data;
  } catch (error) {
    console.error("Error al obtener categoría:", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 Crear nueva categoría
export const createCategoria = async (categoria) => {
  try {
    const { data } = await axios.post(ENDPOINTS.CATEGORIAS.CREATE, categoria, getAuthConfig());
    return data;
  } catch (error) {
    console.error("Error al crear categoría:", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 Actualizar categoría
export const updateCategoria = async (id, categoria) => {
  try {
    const { data } = await axios.put(ENDPOINTS.CATEGORIAS.UPDATE(id), categoria, getAuthConfig());
    return data;
  } catch (error) {
    console.error("Error al actualizar categoría:", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 Eliminar categoría
export const deleteCategoria = async (id) => {
  try {
    const { data } = await axios.delete(ENDPOINTS.CATEGORIAS.DELETE(id), getAuthConfig());
    return data;
  } catch (error) {
    console.error("Error al eliminar categoría:", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 Obtener productos de una categoría
export const getProductosByCategoria = async (id) => {
  try {
    const { data } = await axios.get(ENDPOINTS.CATEGORIAS.GET_PRODUCTOS(id), getAuthConfig());
    return data;
  } catch (error) {
    console.error("Error al obtener productos de la categoría:", error.response?.data || error.message);
    throw error;
  }
};
