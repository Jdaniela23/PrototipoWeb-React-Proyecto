import React, { useState } from 'react';
import './FormAdd.css';
import Nav from '../components/Nav.jsx';
import ProfileCard from '../components/ProfileCard.jsx';
import { useNavigate } from 'react-router-dom';


function FormAdd() {
    const toggleMenu = () => {
        setMenuCollapsed(!menuCollapsed);
    };
    const [menuCollapsed, setMenuCollapsed] = useState(false);
    const navigate = useNavigate();

    // Objeto con TODOS los permisos disponibles en el sistema, por categoría
    // Esto es útil para cuando se crea un nuevo rol y se quieren mostrar todas las opciones.
    const todosLosPermisosDisponibles = {
        'Gestión de Usuarios': [
            'Gestión de Usuarios',
        ],
        'Gestión de Productos': [
            'Gestión de Productos',
        ],
        'Gestión de Pedidos': [
            'Gestión de Pedidos',
        ],
        'Gestión de Roles y Permisos': [
            'Gestión de Roles',
        ],
        'Gestión de Clientes': [
            'Gestión de Clientes',
        ],
        'Gestión de Compras': [
            'Gestión de Compras',
        ],
        'Gestión de Ventas': [
            'Gestión de Ventas',
        ],
        'Dashboard': [
            'Ver dashboard',
        ],
        'Gestión de Perfil': [
            'Gestión de Perfil'
        ],
    };

    const permisosPorRol = {
        Administrador: {
            'Gestión de Usuarios': [
                'Gestión de Usuarios',
            ],
            'Gestión de Productos': [
                'Gestión de Productos',

            ],
            'Gestión de Pedidos': [
                'Gestión de Pedidos',

            ],
            'Gestión de Roles y Permisos': [
                'Gestión de Roles',

            ],
            'Gestión de Clientes': [
                'Gestión de Clientes',

            ],

            'Gestión de Compras': [
                'Gestión de Compras',
            ],
            'Gestión de Ventas': [
                'Gestión de Ventas',
            ],
            'Dashboard': [
                'Ver dashboard con información clave de Compras y Ventas',

            ],
        },

        Cliente: {
            'Gestión de Perfil': [
                'Gestión de Perfil'
            ],
            'Gestión de Compras': [
                'Gestión de Compras',
            ],
        },
        // 'Otro' ya no es necesario aquí como un rol,
        // ya que `todosLosPermisosDisponibles` maneja esa lógica.
        // Si 'Otro' es un rol que realmente existe con esos permisos, déjalo.
        // Para este caso, lo he quitado ya que la idea es usarlo como la fuente de todos los permisos.
    };


    // Estado formulario
    const [roleData, setRoleData] = useState({
        nombreRol: '',
        descripcionRol: '',
        estadoRol: 'Activo',
    });

    // Nuevo estado para el rol personalizado
    const [nuevoRol, setNuevoRol] = useState('');

    // Estado permisos seleccionados (array)
    const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);

    // Manejar cambio inputs formulario
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'nombreRol') {
            setRoleData({
                ...roleData,
                nombreRol: value,
            });
            setPermisosSeleccionados([]); // reset permisos al cambiar rol
            // Si el rol seleccionado es "Administrador" o "Cliente", limpiamos el campo de nuevo rol
            if (value === 'Administrador' || value === 'Cliente') {
                setNuevoRol('');
            }
        } else if (name === 'nuevoRolInput') {
            setNuevoRol(value);
            // Cuando se escribe en el nuevo input, forzamos la selección del "-- Agregar Nuevo rol +"
            setRoleData({
                ...roleData,
                nombreRol: 'Agregar Nuevo rol',
            });
            setPermisosSeleccionados([]); // reset permisos al ingresar un nuevo rol
        } else {
            setRoleData({
                ...roleData,
                [name]: value,
            });
        }
    };

    // Toggle permisos seleccionados
    const togglePermiso = (permiso) => {
        setPermisosSeleccionados((prev) =>
            prev.includes(permiso)
                ? prev.filter((p) => p !== permiso)
                : [...prev, permiso]
        );
    };

    // Enviar formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        // Determinar el nombre final del rol a guardar
        const rolFinal = roleData.nombreRol === 'Agregar Nuevo rol' ? nuevoRol : roleData.nombreRol;

        if (!rolFinal) {
            alert('Por favor, selecciona un rol o ingresa uno nuevo.');
            return;
        }

        const rolCompleto = {
            ...roleData,
            nombreRol: rolFinal, // Usamos el rol determinado
            permisos: permisosSeleccionados,
        };

        console.log('Datos del rol a guardar:', rolCompleto);

        alert('Rol guardado exitosamente!');

        setTimeout(() => {
            navigate('/roles');
        }, 1000);

        setRoleData({
            nombreRol: '',
            descripcionRol: '',
            estadoRol: 'Activo',
        });
        setNuevoRol(''); // Limpiamos el nuevo rol
        setPermisosSeleccionados([]);
    };

    // Obtenemos los permisos disponibles basados en el rol seleccionado (o si es un rol nuevo)
    const permisosAMostrar = roleData.nombreRol === 'Agregar Nuevo rol'
        ? todosLosPermisosDisponibles // Si es nuevo rol, mostramos todos los permisos
        : permisosPorRol[roleData.nombreRol] || {}; // O los permisos del rol existente

    return (
        <div className="role-form-container">
            <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

            <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>

                <div className="formulario-roles">
                    <h1 className="form-title">Registro de Roles</h1>
                    <p className="form-info">Información para registrar diferentes roles a Julieta Streamline Ingresa los campos y Guarda el rol.</p><br /><br />

                    <form onSubmit={handleSubmit} className="role-form">
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
                                rows="3"
                                required
                                className="input-field-categoria-producto"
                            />
                        </div>

                        {/* Permisos dinámicos */}
                        {(roleData.nombreRol && roleData.nombreRol !== 'Agregar Nuevo rol' && permisosPorRol[roleData.nombreRol]) || roleData.nombreRol === 'Agregar Nuevo rol' ? (
                            <div className="form-group permisos-group">
                                <label className="titulo-permisos">Permisos para {roleData.nombreRol === 'Agregar Nuevo rol' ? 'el nuevo rol' : roleData.nombreRol}:<span className="required-asterisk">*</span></label>
                                <div className="permisos-columns-container">
                                    {Object.entries(permisosAMostrar).map(([categoria, listaPermisos]) => (
                                        <div key={categoria} className="categoria-permisos-seccion">

                                            {listaPermisos.map((permiso) => (
                                                <label key={`${categoria}-${permiso}`} className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={permisosSeleccionados.includes(permiso)}
                                                        onChange={() => togglePermiso(permiso)}
                                                    />
                                                    {permiso}
                                                </label>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                        <button className="cancel-button" onClick={() => navigate(-1)}>Cancelar</button>
                        <button type="submit" className="save-button">
                            Guardar Rol
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FormAdd;