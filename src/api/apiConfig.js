// src/api/apiConfig.js
const BASE_URL = 'http://192.168.1.8:5282/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/Auth/login`,
    REGISTER: `${BASE_URL}/Auth/register`,
    GET_BARRIOS: `${BASE_URL}/Barrios`,
    FORGOT_PASSWORD: `${BASE_URL}/Auth/forgot-password`,
    VERIFY_CODE: `${BASE_URL}/Auth/verify-code`,
    RESET_PASSWORD: `${BASE_URL}/Auth/reset-password`,
    DELETE_ACCOUNT: `${BASE_URL}/Auth/delete-account`,
  },
  PRODUCTS: {
    GET_ALL: `${BASE_URL}/Productos`,
    GET_BY_ID: (id) => `${BASE_URL}/Productos/${id}`, // GET: Detalle completo con detalles e imágenes
    CREATE: `${BASE_URL}/Productos`, // POST: Crear producto con detalles y archivos
    UPDATE: (id) => `${BASE_URL}/Productos/${id}`, // PUT: Edición completa
    DELETE: (id) => `${BASE_URL}/Productos/${id}`, // DELETE: Eliminar producto
    CHANGE_STATE: (id) => `${BASE_URL}/Productos/${id}/estado`, // PUT: Cambiar estado (activo/inactivo)
    GET_CATEGORIAS: `${BASE_URL}/CategoriaProductos`,
    GET_ADMIN: `${BASE_URL}/Productos/admin`,
  },
  USUARIOS: {
    MI_PERFIL: `${BASE_URL}/Usuarios/MiPerfil`,
    CAMBIAR_PASSWORD: `${BASE_URL}/Usuarios/CambiarContrasena`,
    UPDATE_PROFILE: `${BASE_URL}/Usuarios/ActualizarPerfil`,
    LISTAR: `${BASE_URL}/Usuarios`,
    ELIMINAR: (id) => `${BASE_URL}/Usuarios/${id}`,
    DETALLE: (id) => `${BASE_URL}/Usuarios/${id}`,
    CAMBIAR_ESTADO: (id) => `${BASE_URL}/Usuarios/CambiarEstado/${id}`,

  },
  ROLES: {
    GET_ALL: `${BASE_URL}/Roles`,
    GET_PERMISOS: `${BASE_URL}/Roles/permisos`,
    CREATE: `${BASE_URL}/Roles`,
    DETALLE_O_ACCION: (id) => `${BASE_URL}/Roles/${id}`,

  },
  TALLAS: {
    GET_ALL: `${BASE_URL}/Tallas`,
    GET_BY_ID: (id) => `${BASE_URL}/Tallas/${id}`,
    CREATE: `${BASE_URL}/Tallas`,
    UPDATE: (id) => `${BASE_URL}/Tallas/${id}`,
    DELETE: (id) => `${BASE_URL}/Tallas/${id}`,
  },

  COLORES: {
    GET_ALL: `${BASE_URL}/Colores`,
    GET_BY_ID: (id) => `${BASE_URL}/Colores/${id}`,
    CREATE: `${BASE_URL}/Colores`,
    UPDATE: (id) => `${BASE_URL}/Colores/${id}`,
    DELETE: (id) => `${BASE_URL}/Colores/${id}`,
  },

  PEDIDOS: {
    GET_ALL: `${BASE_URL}/Pedidos/admin`,
    CREATE: `${BASE_URL}/Pedidos/crear`,
    GET_BY_ID: (id) => `${BASE_URL}/Pedidos/${id}`,
    UPDATE: (id) => `${BASE_URL}/Pedidos/${id}`,
    DELETE: (id) => `${BASE_URL}/Pedidos/${id}`,
    GET_BY_CLIENTE: (idUsuario) => `${BASE_URL}/Pedidos/cliente/${idUsuario}`,
  },
  DETALLE_PRODUCTOS: {
    GET_ALL: `${BASE_URL}/detalleProductos`,
    GET_BY_ID: (id) => `${BASE_URL}/detalleProductos/${id}`,
  },
  CATEGORIAS: {
    GET_ALL: `${BASE_URL}/CategoriaProductos`,
    GET_BY_ID: (id) => `${BASE_URL}/CategoriaProductos/${id}`,
    CREATE: `${BASE_URL}/CategoriaProductos`,
    UPDATE: (id) => `${BASE_URL}/CategoriaProductos/${id}`,
    DELETE: (id) => `${BASE_URL}/CategoriaProductos/${id}`,
    GET_PRODUCTOS: (id) => `${BASE_URL}/CategoriaProductos/${id}/productos`,
  },
  PROVEEDORES: {
    GET_ALL: `${BASE_URL}/Proveedores`,
    CREATE: ` ${BASE_URL}/Proveedores`,
    UPDATE: `${BASE_URL}/Proveedores`,
  },
  COMPRAS: {
    GET_ALL: `${BASE_URL}/Compras`,
    CREATE: `${BASE_URL}/Compras`,
    UPDATE: `${BASE_URL}/Compras`,
  },
  DETALLECOMPRAS: {
    GET_ALL: `${BASE_URL}/DetalleCompras`,
    DELETE: `${BASE_URL}/DetalleCompras`,
  },
  // añadir más controladores aquí, como:
  // BARRIOS: {
  //   GET_ALL: `${BASE_URL}/Barrios/GetAll`,
  // },
};
