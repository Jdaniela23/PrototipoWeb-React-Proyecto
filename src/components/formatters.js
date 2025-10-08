// Función para formato corto (ej. "02/10/2025, 2:45 a. m.")
export const formatFechaCorta = (isoString) => {
    if (!isoString) return 'N/A';

    const date = new Date(isoString);

    const options = {
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    };

    // Usamos 'es-CO' 
    return date.toLocaleDateString('es-CO', options); 
};

