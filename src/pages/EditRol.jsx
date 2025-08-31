import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import './FormAdd.css'; 

function EditRol() {
  const location = useLocation();
  const rolEdit = location.state?.rol; // Recibe rol a editar (objeto)

  // Objeto con TODOS los permisos disponibles en el sistema, por categoría
  // (Este es el mismo objeto que usamos en FormAdd.jsx para tener todos los permisos)
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
      'Ver dashboard con información clave de Compras y Ventas',
    ],
    'Gestión de Perfil': [
      'Gestión de Perfil'
    ],
  };

  const permisosPorRol = {
    Administrador: {
      'Gestión de Usuarios': ['Gestión de Usuarios'],
      'Gestión de Productos': ['Gestión de Productos'],
      'Gestión de Pedidos': ['Gestión de Pedidos'],
      'Gestión de Roles y Permisos': ['Gestión de Roles'],
      'Gestión de Clientes': ['Gestión de Clientes'],
      'Gestión de Compras': ['Gestión de Compras'],
      'Gestión de Ventas': ['Gestión de Ventas'],
      'Dashboard': ['Ver dashboard con información clave de Compras y Ventas'],
    },
    Cliente: {
      'Gestión de Perfil': ['Gestión de Perfil'],
      'Gestión de Compras': ['Gestión de Compras'],
    },
  };

  // Estado inicial con datos del rol que editamos o vacíos
  const [roleData, setRoleData] = useState({
    nombreRol: rolEdit?.nombreRol || '',
    descripcionRol: rolEdit?.descripcion || '',
    estadoRol: rolEdit?.estado || 'Activo',
  });

  const [permisosSeleccionados, setPermisosSeleccionados] = useState(
    Array.isArray(rolEdit?.permisos) ? rolEdit.permisos : []
  );

  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const navigate = useNavigate();

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
    setRoleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const rolActualizado = {
      ...roleData,
      permisos: permisosSeleccionados,
    };

    console.log('Rol actualizado:', rolActualizado);

    alert('Rol actualizado exitosamente!');

    setTimeout(() => {
      navigate('/roles');
    }, 1000);
  };


  const permisosAMostrar = (roleData.nombreRol === 'Administrador' || roleData.nombreRol === 'Cliente')
    ? permisosPorRol[roleData.nombreRol]
    : todosLosPermisosDisponibles; // Si es un rol personalizado o vacío, mostramos todos los permisos

  return (
    <div className="role-form-container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>


        <div className="formulario-roles">
          <h1 className="form-title">Editar Rol</h1>
          <p className="form-info">Modifica los datos y permisos del rol seleccionado</p><br /><br />

          <form onSubmit={handleSubmit} className="role-form">
            <div className="form-group">
              <label htmlFor="nombreRol" className="label-heading">
                Nombre del Rol:  <span className="required-asterisk">*</span> {/* Añadido asterisco */}
              </label>
              <select
                id="nombreRol"
                name="nombreRol"
                value={roleData.nombreRol}
                onChange={handleChange}
                required
                className="input-field"
                // Deshabilitar la edición del nombre del rol si no es un nuevo rol,
                // para evitar que se cambie el rol base (Administrador/Cliente)
                // y se desordenen los permisos iniciales asociados a ellos.
                // Si quieres permitir cambiar a un rol predefinido o nuevo, quita 'disabled'.
                disabled={rolEdit?.nombreRol === 'Administrador' || rolEdit?.nombreRol === 'Cliente'}
              >
                <option value="">-- Seleccione un rol --</option>
                {/* Opciones solo si el rol no es predefinido o si se está creando uno nuevo */}
                {/* En Editar, solo listamos el rol actual y quizás "Agregar Nuevo rol" si quieres esa funcionalidad */}
                <option value="Administrador">Administrador</option>
                <option value="Cliente">Cliente</option>
                {/* Puedes añadir una opción para "Agregar Nuevo rol" si quieres permitir convertir un rol existente en uno personalizado aquí */}
                {/* <option value="Agregar Nuevo rol">-- Agregar Nuevo rol +</option> */}
                {/* Para roles personalizados que no sean "Administrador" o "Cliente", aseguramos que su nombre se muestre */}
                {(!['Administrador', 'Cliente'].includes(roleData.nombreRol) && roleData.nombreRol) && (
                  <option value={roleData.nombreRol}>{roleData.nombreRol}</option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="descripcionRol" className="label-heading">
                Descripción: <span className="required-asterisk">*</span> {/* Añadido asterisco */}
              </label>
              <textarea
                id="descripcionRol"
                name="descripcionRol"
                placeholder="Descripción Rol"
                value={roleData.descripcionRol}
                onChange={handleChange}
                rows="3"
                required
                className="input-field textarea-field" // Añadida clase 'textarea-field' para consistencia
              />
            </div>

            {/* Sección de Permisos */}
            {/* Solo muestra permisos si hay un nombre de rol seleccionado */}
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
                            />
                            {permiso}
                          </label>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Contenedor para los botones de acción */}
            <div className="form-actions"> {/* Clase agregada para centrar y espaciar botones */}
              <button type="submit" className="save-button">
                Actualizar Rol
              </button>

            </div>
            <button type="button" className="cancel-button" onClick={() => navigate(-1)}> {/* type="button" para evitar envío */}
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditRol;