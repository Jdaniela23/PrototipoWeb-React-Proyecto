// src/api/detalleProductosService.js
import axios from 'axios';
import { ENDPOINTS } from './apiConfig';

export const getDetalleProductos = async () => {
  try {
    const { data } = await axios.get(ENDPOINTS.DETALLE_PRODUCTOS.GET_ALL);
    return data;
  } catch (error) {
    console.error("Error al obtener detalles de productos:", error.response?.data || error.message);
    throw error;
  }
};

export const getDetalleProductoById = async (id) => {
  try {
    const { data } = await axios.get(ENDPOINTS.DETALLE_PRODUCTOS.GET_BY_ID(id));
    return data;
  } catch (error) {
    console.error("Error al obtener detalle de producto:", error.response?.data || error.message);
    throw error;
  }
};