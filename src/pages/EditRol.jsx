import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import './FormAdd.css';
import { FaSave} from 'react-icons/fa';
import { updateRol } from '../api/rolesService.js';

const aplanarPermisos = (permisosAgrupados) => {
    if (!permisosAgrupados || typeof permisosAgrupados !== 'object') return [];
    // Object.values() obtiene los arrays de permisos, y .flat() los une en una sola lista.
    return Object.values(permisosAgrupados).flat();
};

function EditRol() {
    const location = useLocation();
    const [permisoError, setPermisoError] = useState('');
    const rolEdit = location.state?.rol;
    const navigate = useNavigate();

    //  Verificación inicial para evitar errores si no se pasó el rol
    if (!rolEdit) {
        navigate('/roles', { state: { errorMessage: 'No se encontró el rol para editar.' } });
        return null;
    }

    // Objeto con TODOS los permisos disponibles en el sistema 
    const todosLosPermisosDisponibles = {
        'Gestión de Usuarios': ['Gestión de Usuarios'],
        'Gestión de Productos': ['Gestión de Productos'],
        'Gestión de Pedidos': ['Gestión de Pedidos'],
        'Gestión de Roles y Permisos': ['Gestión de Roles'],
        'Gestión de Clientes': ['Gestión de Clientes'],
        'Gestión de Compras': ['Gestión de Compras'],
        'Gestión de Ventas': ['Gestión de Ventas'],
        'Dashboard': ['Dashboard'],
        'Gestión de Perfil': ['Gestión de Perfil'],
    };

    // 1. ESTADO INICIAL AJUSTADO: Se guardan ID, Fecha_Creacion y Descripción
    const [roleData, setRoleData] = useState({
        id: rolEdit.id,
        nombreRol: rolEdit.nombreRol || '',
        descripcionRol: rolEdit.descripcion || '',
        fecha_Creacion: rolEdit.fecha_Creacion || 'N/A',
    });


    const [permisosSeleccionados, setPermisosSeleccionados] = useState(
        aplanarPermisos(rolEdit.permisos)
    );

    const [menuCollapsed, setMenuCollapsed] = useState(false);

    //  NUEVOS ESTADOS para Manejo de UI/Errores 
    const [loading, setLoading] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({
        nombreRol: '', // Para el error de duplicado
    });
    const [generalMessage, setGeneralMessage] = useState(null); // Para errores que no son de campo

    const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

    const togglePermiso = (permiso) => {
        setPermisosSeleccionados((prev) =>
            prev.includes(permiso)
                ? prev.filter((p) => p !== permiso)
                : [...prev, permiso]
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setGeneralMessage(null);

        if (name === 'nombreRol') {
            const hasNumbers = /\d/.test(value); 


            if (hasNumbers) {
                // Si hay números, mostramos el error
                setFieldErrors(prev => ({
                    ...prev,
                    nombreRol: 'El nombre del rol no debe contener números (dígitos).'
                }));
            } else {
                // Si no hay números, limpiamos el error anterior
                setFieldErrors(prev => ({ ...prev, nombreRol: '' }));
            }
        }
        setRoleData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Función de cancelación con estado de carga
    const handleCancel = () => {
        setIsCancelling(true);
        setTimeout(() => { // Simulamos un pequeño retraso
            navigate(-1);
        }, 300);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setGeneralMessage(null);
        setFieldErrors({ nombreRol: '' });

        //Validación de permisos debe haber minimo 1
        if (permisosSeleccionados.length === 0) {
             setPermisoError('Debe seleccionar al menos un permiso para el nuevo rol.');
                setLoading(false);
            return; // Detiene el envío si no hay permisos
        }

        const rolParaApi = {
            "Id_Rol": roleData.id,
            "Nombre_Rol": roleData.nombreRol,
            "Descripcion_Rol": roleData.descripcionRol,
            "Estado_Rol": rolEdit.estado,
            "Permisos": permisosSeleccionados,
        };

        try {
            await updateRol(rolParaApi);
            navigate('/roles', {
                state: {
                    successMessage: `El rol '${rolParaApi.Nombre_Rol}' ha sido actualizado exitosamente.`
                }
            });

        } catch (error) {
            const originalErrorMessage = error.message || error.response?.data?.message || 'Error desconocido.';

            let isConflictError = false;

            // Detección del error de duplicado 
            if (originalErrorMessage.includes('Conflicto') || originalErrorMessage.toLowerCase().includes('ya existe')) {


                const nuevoMensajeDeError = `⚠️ El nombre de rol "${rolParaApi.Nombre_Rol}" ya está registrado por otro rol, elige uno diferente.`;

                setFieldErrors(prev => ({ ...prev, nombreRol: nuevoMensajeDeError }));
                isConflictError = true;
            }

            // Si es un error general (ej. de red, 500, etc.) lo mostramos en el banner
            if (!isConflictError) {
                setGeneralMessage(`Error al actualizar el rol: ${originalErrorMessage}`);
            }

            console.error('Error al actualizar rol:', error.response?.data || error.message);

        } finally {
            setLoading(false);
        }
    };


    const permisosAMostrar = todosLosPermisosDisponibles;

    return (
        <div className="role-form-container">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

            <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>

                <div className="formulario-roles">
                    <h1 className="form-title">Editar Rol: {rolEdit.nombreRol}</h1>
                    <p className="form-info">Modifica los datos y permisos del rol seleccionado</p><br /><br />

                    {/* Mensaje de error general (Banner) */}
                    {generalMessage && (
                        <div className="alert alert-error">
                            {generalMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="role-form">

                        {/* Campo Nombre Rol */}
                        <div className="form-group">
                            <label htmlFor="nombreRol" className="label-heading">
                                Nombre del Rol:  <span className="required-asterisk">*</span>
                            </label>
                            <input
                                id="nombreRol"
                                name="nombreRol"
                                type="text"
                                value={roleData.nombreRol}
                                onChange={handleChange}
                                required
                                className="input-field"
                                disabled={loading || isCancelling}
                            />
                            {/*  Mensaje de error de campo  */}

                            {fieldErrors.nombreRol && <p className="error-message-rol">{fieldErrors.nombreRol}</p>}
                        </div>

                        {/* Campo Descripción */}
                        <div className="form-group">
                            <label htmlFor="descripcionRol" className="label-heading">
                                Descripción: <span className="required-asterisk">*</span>
                            </label>
                            <textarea
                                id="descripcionRol"
                                name="descripcionRol"
                                placeholder="Descripción Rol"
                                value={roleData.descripcionRol}
                                onChange={handleChange}
                                rows="3"
                                required
                                className="input-field textarea-field"
                                disabled={loading || isCancelling}
                            />
                        </div>

                        {/* Sección de Permisos */}
                        {roleData.nombreRol && (
                            <div className="form-group permisos-group">
                                <label className="titulo-permisos">Permisos para {roleData.nombreRol}:<span className="required-asterisk">*</span></label>
                                <div className="permisos-columns-container">
                                    {Object.entries(permisosAMostrar).map(
                                        ([categoria, listaPermisos]) => (
                                            <div key={categoria} className="categoria-permisos-seccion">

                                                {listaPermisos.map((permiso) => (
                                                    <label key={`${categoria}-${permiso}`} className="checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={permisosSeleccionados.includes(permiso)}
                                                            onChange={() => togglePermiso(permiso)}
                                                            disabled={loading || isCancelling}
                                                        />
                                                        {permiso}
                                                    </label>
                                                ))}
                                                
                                            </div>
                                            
                                        )
                                    )}
                                
                                </div>
                                    {permisoError && <p className="error-message-rol">{permisoError}</p>}
                            </div>
                        )}


                        <div className="form-actions">
                            <button type="submit" className="save-button" disabled={loading || isCancelling}>
                                <FaSave style={{ marginRight: '8px' }} />
                                {loading ? 'Actualizando...' : 'Actualizar Rol'}
                            </button>
                        </div>
                        {/* El botón Cancelar ahora tiene su propia lógica de estado */}
                        <button type="button" className="cancel-button" onClick={handleCancel} disabled={loading || isCancelling}>

                            {isCancelling ? 'Cancelando...' : 'Cancelar'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditRol;