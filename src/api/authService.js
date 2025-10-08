// src/api/authService.js
import axios from 'axios';
import { ENDPOINTS } from './apiConfig'; // <-- Importa desde aquí

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(ENDPOINTS.AUTH.LOGIN, { // <-- Usa la constante
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// ⭐ Función para registrar/crear cuenta nuevos usuarios ⭐
export const registerUser = async (userData) => { 
  try {
    const response = await axios.post(ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  } catch (error) {
    console.error("Error al registrar el usuario:", error.response ? error.response.data : error.message);
    throw error;
  }
};

//Función para obtener los Barrios
export const getBarrios = async () => {
    try {
        const response = await axios.get(ENDPOINTS.AUTH.GET_BARRIOS);
        return response.data;
    } catch (error) {
        console.error("Error al obtener los barrios:", error.response ? error.response.data : error.message);
        throw error;
    }
};

//Función para manejar la solicitud de recuperar pass
export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};


//Función para verificar el codigo
export const verifyCode = async (email, code) => {
    try {
        const response = await axios.post(ENDPOINTS.AUTH.VERIFY_CODE, { email, code });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};


//Función para los reenviar codigo
export const resendForgotPasswordCode = async (email) => {
    try {
        const response = await axios.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Función para restablecer la contraseña
export const resetPassword = async (email, code, newPassword) => {
    try {
        // ⭐ Usa el endpoint correcto de tu archivo de configuración
        const response = await fetch(ENDPOINTS.AUTH.RESET_PASSWORD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                code,
                newPassword,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.message || 'Error al restablecer la contraseña.');
            error.status = response.status;
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error en resetPassword:', error);
        throw error;
    }
};


//Función para obtener perfil cliente
export const getMyProfile = async () => {
  const token = localStorage.getItem('userToken');

  if (!token) {
    console.error("No se encontró un token de autenticación.");
    throw new Error('No se encontró un token. Por favor, inicia sesión.');
  }

  try {
    const response = await fetch(ENDPOINTS.USUARIOS.MI_PERFIL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Envía el token en el header de autorización
      },
    });

    const text = await response.text();

    if (!response.ok) {
      const errorMessage = text || `Error de la API con estado: ${response.status}`;
      throw new Error(errorMessage);
    }

    if (!text) {
      throw new Error('La llamada a la API fue exitosa, pero la respuesta está vacía. Es posible que no se hayan encontrado los datos del perfil.');
    }

    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Fallo la llamada a getMyProfile:", error);
    throw error;
  }
};
export const deleteMyAccount = async () => {
  const token = localStorage.getItem('userToken');

  if (!token) {
    throw new Error('No se encontró un token. Por favor, inicia sesión.');
  }

  try {
    const response = await fetch(ENDPOINTS.AUTH.DELETE_ACCOUNT, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Error de la API con estado: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al eliminar la cuenta:", error);
    throw error;
  }
};
// --- Cambiar contraseña ---
export const changePassword = async (passwordDto) => {
  const token = localStorage.getItem('userToken');

  if (!token) {
    throw new Error('No se encontró un token. Por favor, inicia sesión.');
  }

  try {
    const response = await fetch(ENDPOINTS.USUARIOS.CAMBIAR_PASSWORD, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(passwordDto)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Error de la API con estado: ${response.status}`);
    }

    return await response.json().catch(() => ({})); 
    // algunos PUT devuelven vacío, por eso .catch(() => ({}))
  } catch (error) {
    console.error("Error en changePassword:", error);
    throw error;
  }
};



// ⭐ FUNCIÓN PARA ACTUALIZAR EL PERFIL ⭐
// --- src/api/authService.js (VERSIÓN FINAL CON FETCH) ---

export const updateMyProfile = async (profileData) => {
    // profileData es un objeto FormData
    const token = localStorage.getItem('userToken');

    if (!token) {
        throw new Error('No se encontró un token. Por favor, inicia sesión.');
    }

    try {
        const response = await fetch(ENDPOINTS.USUARIOS.UPDATE_PROFILE, {
            method: 'PUT',
            // ⭐ CRÍTICO: NO incluimos Content-Type. El navegador lo calcula para FormData.
            headers: {
                'Authorization': `Bearer ${token}`, // Solo enviamos el token
            },
            body: profileData, // Enviamos el objeto FormData directamente
        });

        const text = await response.text();

        if (!response.ok) {
            throw new Error(text || `Error de la API con estado: ${response.status}`);
        }

        return text ? JSON.parse(text) : {}; 
    } catch (error) {
        console.error('Error en updateProfile (fetch):', error);
        throw error;
    }
};
  