import React, { useState, useEffect } from 'react';
import './FormAdd.css';
import Nav from '../components/Nav.jsx';
import { fetchAllPermisos, createNewRole, ESTADO_ROL } from '../api/rolesService';
import { useNavigate } from 'react-router-dom';

// Función auxiliar para organizar la lista plana de permisos del backend
const categorizePermisos = (permisosArray) => {
    const categorias = {};
    permisosArray.forEach(permiso => {
        let categoria = 'Otros Permisos';

        if (permiso.includes('Gestión de Usuarios')) categoria = 'Gestión de Usuarios';
        else if (permiso.includes('Gestión de Productos')) categoria = 'Gestión de Productos';
        else if (permiso.includes('Gestión de Pedidos')) categoria = 'Gestión de Pedidos';
        else if (permiso.includes('Gestión de Roles')) categoria = 'Gestión de Roles y Permisos';
        else if (permiso.includes('Gestión de Clientes')) categoria = 'Gestión de Clientes';
        else if (permiso.includes('Gestión de Compras')) categoria = 'Gestión de Compras';
        else if (permiso.includes('Gestión de Ventas')) categoria = 'Gestión de Ventas';
        else if (permiso.includes('Dashboard') || permiso.includes('Ver dashboard')) categoria = 'Dashboard';
        else if (permiso.includes('Gestión de Perfil')) categoria = 'Gestión de Perfil';

        if (!categorias[categoria]) {
            categorias[categoria] = [];
        }
        categorias[categoria].push(permiso);
    });
    return categorias;
};


function FormAdd() {
    const navigate = useNavigate();
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

    // ESTADOS PARA MANEJAR LA API
    const [permisosDisponibles, setPermisosDisponibles] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [permisoError, setPermisoError] = useState('');

    // Estructura de permisos predefinidos para roles existentes
    const permisosPorRol = {
        Administrador: {
            'Gestión de Usuarios': ['Gestión de Usuarios'],
            'Gestión de Productos': ['Gestión de Productos'],
            'Gestión de Pedidos': ['Gestión de Pedidos'],
            'Gestión de Roles y Permisos': ['Gestión de Roles'],
            'Gestión de Clientes': ['Gestión de Clientes'],
            'Gestión de Compras': ['Gestión de Compras'],
            'Gestión de Ventas': ['Gestión de Ventas'],
            'Dashboard': ['Ver dashboard'],
            'Gestión de Perfil': ['Gestión de Perfil'],
        },
        Cliente: {
            'Gestión de Perfil': ['Gestión de Perfil'],
            'Gestión de Compras': ['Gestión de Compras'],
        },
    };

    // Estado formulario
    const [roleData, setRoleData] = useState({
        nombreRol: '',
        descripcionRol: '',
        estadoRol: ESTADO_ROL.ACTIVO,
    });

    const [nuevoRol, setNuevoRol] = useState('');
    const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);
    
    //ESTADO PARA ERRORES ESPECÍFICOS DE CAMPO 
    const [fieldErrors, setFieldErrors] = useState({
        nuevoRol: '', 
    });

    // 1. Cargar Permisos al Montar el Componente
    useEffect(() => {
        const loadPermisos = async () => {
            try {
                const data = await fetchAllPermisos();
                setPermisosDisponibles(categorizePermisos(data));
            } catch (error) {
                setMessage(error.message || 'Error al cargar la lista de permisos.');
                console.error('Error cargando permisos:', error);
            }
        };
        loadPermisos();
    }, []);

   // Manejar cambio inputs formulario
const handleChange = (e) => {
    const { name, value } = e.target;

    setMessage(null);
    const onlyLettersAndSpaces = /^[a-zA-Z\s]*$/; 

    if (name === 'nombreRol') {
        setRoleData({
            ...roleData,
            nombreRol: value,
        });
        setPermisosSeleccionados([]);
        setFieldErrors(prev => ({ ...prev, nuevoRol: '' })); 

        if (value === 'Administrador' || value === 'Cliente') {
            setNuevoRol('');
        }
        else if (value === 'Agregar Nuevo rol') {
            setNuevoRol('');
        }
    }
    else if (name === 'nuevoRolInput') {
        setNuevoRol(value);
        if (value === '' || onlyLettersAndSpaces.test(value)) {
            setNuevoRol(value);
            setFieldErrors(prev => ({ ...prev, nuevoRol: '' })); 
        } else {
            setFieldErrors(prev => ({ ...prev, nuevoRol: 'El nombre del rol solo puede contener letras y espacios.' })); 
            return; 
        }
        
        if (roleData.nombreRol !== 'Agregar Nuevo rol') {
            setRoleData({
                ...roleData,
                nombreRol: 'Agregar Nuevo rol',
            });
        }
    } else {
        setRoleData({
            ...roleData,
            [name]: value,
        });
    }
};

    // Toggle permisos seleccionados (Solo aplica para "Agregar Nuevo rol")
    const togglePermiso = (permiso) => {
        if (roleData.nombreRol !== 'Agregar Nuevo rol') return;

        setPermisosSeleccionados((prev) =>
            prev.includes(permiso)
                ? prev.filter((p) => p !== permiso)
                : [...prev, permiso]
        );
    };

    // 2. Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);
        setPermisoError('');
        // Limpiamos el error de campo antes de intentar enviar
        setFieldErrors({ nuevoRol: '' }); 

        // 1. Determinar el nombre final y limpio del rol.
        const rolFinal = roleData.nombreRol === 'Agregar Nuevo rol' ? nuevoRol.trim() : roleData.nombreRol;

        if (!rolFinal) {
            setMessage('Por favor, selecciona un rol o ingresa uno nuevo.');
            setLoading(false);
            return;
        }

        // 2. Determinar la lista de permisos a enviar.
        let permisosParaEnviar = [];
        const onlyLettersAndSpaces = /^[a-zA-Z\s]*$/;
        if (roleData.nombreRol === 'Agregar Nuevo rol' && rolFinal && !onlyLettersAndSpaces.test(rolFinal)) {
            const errorMsg = 'El nombre del nuevo rol no puede contener números. Solo letras y espacios.';
            setFieldErrors(prev => ({ ...prev, nuevoRol: errorMsg }));
            setLoading(false);
            setMessage(errorMsg); 
            return;
        }

        if (roleData.nombreRol === 'Agregar Nuevo rol') {
            if (permisosSeleccionados.length === 0) {

                setPermisoError('Debe seleccionar al menos un permiso para el nuevo rol.');
                setLoading(false);
                return;
            }
            permisosParaEnviar = permisosSeleccionados;
        }
        else if (roleData.nombreRol && permisosPorRol[roleData.nombreRol]) {
            permisosParaEnviar = Object.values(permisosPorRol[roleData.nombreRol]).flat();
        }

        // 3. Construcción del Payload FINAL. 
        const payloadParaServicio = {
            "nombreRol": rolFinal,
            "descripcionRol": roleData.descripcionRol,
            "estadoRol": roleData.estadoRol || ESTADO_ROL.ACTIVO,
            "permisos": permisosParaEnviar,
        };
        
        try {
            // 4. Llamada a la API de Creación
            const result = await createNewRole(payloadParaServicio);

            navigate('/roles', {
                state: {
                    successMessage: result.message || `Rol "${rolFinal}" creado exitosamente.`
                }
            });

            setRoleData({
                nombreRol: '',
                descripcionRol: '',
                estadoRol: ESTADO_ROL.ACTIVO,
            });
            setNuevoRol('');
            setPermisosSeleccionados([]);

        } catch (error) {
            const errorMessage = error.message || 'Error desconocido al guardar el rol.';
            
            let isConflictError = false;
            
        
            if (errorMessage.includes('Error:') || errorMessage.toLowerCase().includes('ya existe')) {
                const nuevoMensajeDeError = `⚠️ El nombre de rol "${rolFinal}" ya está en uso, elige uno diferente.`;

        setFieldErrors(prev => ({ ...prev, nuevoRol: nuevoMensajeDeError }));
        isConflictError = true;
              
            }

            if (!isConflictError) {
                 setMessage(`Error al guardar el rol: ${errorMessage}`);
            } else {
                 setMessage(null); 
            }
            
            console.error("Error al guardar el rol:", error);
        } finally {
            setLoading(false);
        }
    };

    // Obtenemos los permisos disponibles basados en el rol seleccionado (o si es un rol nuevo)
    const permisosAMostrar = roleData.nombreRol === 'Agregar Nuevo rol'
        ? permisosDisponibles
        : permisosPorRol[roleData.nombreRol] || {};

    const isReady = Object.keys(permisosDisponibles).length > 0 || (roleData.nombreRol && roleData.nombreRol !== 'Agregar Nuevo rol' && permisosPorRol[roleData.nombreRol]);

    return (
        <div className="role-form-container">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

            <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>

                <div className="formulario-roles">
                    <h1 className="form-title">Registro de Roles</h1>
                    <p className="form-info">Información para registrar diferentes roles a Julieta Streamline. Ingresa los campos y Guarda el rol.</p><br /><br />

                    {/* Mensajes de feedback (éxito/error) */}
                    {message && (
                        <div className={`alert ${message.includes('Error') || message.includes('No autorizado') ? 'alert-error' : 'alert-success'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="role-form ">
                        {/* Selector de Rol */}
                        <div className="form-group">
                            <label htmlFor="nombreRol" className="label-heading">Nombre del Rol<span className="required-asterisk">*</span></label>
                            <select
                                id="nombreRol"
                                name="nombreRol"
                                value={roleData.nombreRol}
                                onChange={handleChange}
                                required
                                className="input-field"
                            >
                                <option value="">-- Seleccione un rol --</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Cliente">Cliente</option>
                                <option value="Agregar Nuevo rol">-- Agregar Nuevo rol +</option>
                            </select>
                    
                        </div>

                        {/* Campo para nuevo rol, visible solo si se selecciona "Agregar Nuevo rol +" */}
                        {roleData.nombreRol === 'Agregar Nuevo rol' && (
                            <div className="form-group">
                                <label htmlFor="nuevoRolInput" className="label-heading">Nombre del Nuevo Rol<span className="required-asterisk">*</span></label>
                                <input
                                    type="text"
                                    id="nuevoRolInput"
                                    name="nuevoRolInput"
                                    value={nuevoRol}
                                    onChange={handleChange}
                                    placeholder="Ej: Gerente, Ventas, etc."
                                    required
                                    className="input-field"
                                />
                        
                                {fieldErrors.nuevoRol && <p className="error-message-rol">{fieldErrors.nuevoRol}</p>}
                            </div>
                        )}

                        {/* Descripción */}
                        <div className="form-group">
                            <label htmlFor="descripcionRol" className="label-heading">Descripción<span className="required-asterisk">*</span></label>
                            <textarea
                                id="descripcionRol"
                                name="descripcionRol"
                                placeholder="Descripción Rol"
                                value={roleData.descripcionRol}
                                onChange={handleChange}
                                required
                                className="input-field"
                            />
                        </div>


                        {/* Permisos dinámicos */}
                        {isReady && roleData.nombreRol ? (
                            <div className="form-group permisos-group">
                                <label className="titulo-permisos">Permisos para {roleData.nombreRol === 'Agregar Nuevo rol' ? nuevoRol || 'el nuevo rol' : roleData.nombreRol}:<span className="required-asterisk">*</span></label>
                                <div className="permisos-columns-container">
                                    {Object.entries(permisosAMostrar).map(([categoria, listaPermisos]) => (
                                        <div key={categoria} className="categoria-permisos-seccion">
                                            {listaPermisos.length > 1 && <h4 className='categoria-titulo'>{categoria}</h4>}

                                            {listaPermisos.map((permiso) => {
                                                const isChecked = roleData.nombreRol === 'Agregar Nuevo rol'
                                                    ? permisosSeleccionados.includes(permiso)
                                                    : listaPermisos.includes(permiso);

                                                const isDisabled = roleData.nombreRol !== 'Agregar Nuevo rol';

                                                return (
                                                    <label key={`${categoria}-${permiso}`} className="checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            disabled={isDisabled}
                                                            checked={isChecked}
                                                            onChange={() => togglePermiso(permiso)}
                                                        />
                                                        {permiso}
                                                      
                                                    </label>
                                                    
                                                );
                                                
                                            })}
                                        </div>

                                    ))}
                                </div>
                                {roleData.nombreRol !== 'Agregar Nuevo rol' && roleData.nombreRol !== '' && (
                                    <p className="advertencia-permisos">
                                        Los permisos para el rol **{roleData.nombreRol}** están predefinidos y no son editables.
                                        
                                    </p>
                                )}
                                  {permisoError && <p className="error-message-rol">{permisoError}</p>}
                            </div>
                            
                        ) : roleData.nombreRol === 'Agregar Nuevo rol' && !isReady ? (
                            <div className="form-group"><p>Cargando lista de permisos...</p></div>
                        ) : null}


                        <button type="submit" className="save-button" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar Rol'}
                        </button>
                    </form>
                    <button className="cancel-button" onClick={() => navigate(-1)} disabled={loading}>Cancelar</button>
                </div>
            </div>
        </div>
    );
}

export default FormAdd;