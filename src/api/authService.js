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

// Función para registrar/crear cuenta nuevos usuarios
export const registerUser = async (formDataToSend) => { 
    // formDataToSend ya es un objeto FormData
    
    try {
        // Axios se encarga de enviar el FormData con Content-Type: multipart/form-data
        const response = await axios.post(
            ENDPOINTS.AUTH.REGISTER, 
            formDataToSend 
        );
        return response.data;
        
    } catch (error) {
        console.error("Error completo de registro (Axios):", error);
        
        let errorMessage = "Error de red o desconocido.";
        
        if (axios.isAxiosError(error) && error.response) {
            const responseData = error.response.data;

            // CRÍTICO: Captura la cadena de texto simple de tu BadRequest("Mensaje...")
            if (typeof responseData === 'string') {
                errorMessage = responseData;
            
            // Captura los errores de validación de ModelState (si devuelve un objeto JSON)
            } else if (typeof responseData === 'object' && responseData.errors) {
                let validationMessages = [];
                for (const key in responseData.errors) {
                    if (responseData.errors[key] && Array.isArray(responseData.errors[key])) {
                        validationMessages.push(responseData.errors[key][0]); 
                    }
                }
                errorMessage = "Validación fallida: " + validationMessages.join('; ');

            // Captura errores con una propiedad 'message'
            } else if (typeof responseData === 'object' && responseData.message) {
                 errorMessage = responseData.message;
            } else {
                 errorMessage = `Error ${error.response.status}: Ha ocurrido un error al procesar la solicitud.`;
            }
        } else if (axios.isAxiosError(error) && error.request) {
            errorMessage = "No se pudo conectar al servidor. Verifica tu red.";
        } else {
            errorMessage = error.message;
        }

        throw new Error(errorMessage); 
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
export const updateMyProfile = async (profileData) => {
    const token = localStorage.getItem('userToken');

    if (!token) {
        throw new Error('No se encontró un token. Por favor, inicia sesión.');
    }

    try {
        const isFormData = profileData instanceof FormData;

        const response = await axios.put(
            ENDPOINTS.USUARIOS.UPDATE_PROFILE,
            profileData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...(isFormData ? {} : { "Content-Type": "application/json" }),
                }
            }
        );

        console.log("✅ RESPUESTA DEL BACKEND:", response.data);
        return response.data;

    } catch (error) {
        console.error("❌ ERROR DEL BACKEND:", error.response?.data || error);
        throw error;
    }
};


  