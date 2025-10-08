import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import './FormAdd.css';
import { FaSave } from 'react-icons/fa';
// 🚨 Importar la función de servicio que actualiza el rol
import { updateRol } from '../api/rolesService.js';

// --- Función de utilidad para aplanar permisos (si vienen agrupados) ---
const aplanarPermisos = (permisosAgrupados) => {
  if (!permisosAgrupados || typeof permisosAgrupados !== 'object') return [];
  // Object.values() obtiene los arrays de permisos, y .flat() los une en una sola lista.
  return Object.values(permisosAgrupados).flat();
};

function EditRol() {
  const location = useLocation();
  const rolEdit = location.state?.rol; // Recibe rol a editar (objeto)
  const navigate = useNavigate();

  // 🛑 Verificación inicial para evitar errores si no se pasó el rol
  if (!rolEdit) {
    navigate('/roles', { state: { errorMessage: 'No se encontró el rol para editar.' } });
    return null;
  }

  // Objeto con TODOS los permisos disponibles en el sistema (Se mantiene para la UI)
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

  // Permisos predefinidos (Se mantiene para la lógica de roles base)
  const permisosPorRol = {
    Administrador: todosLosPermisosDisponibles, // Asumo que Admin tiene todos
    Cliente: {
      'Gestión de Perfil': ['Gestión de Perfil'],
      'Gestión de Compras': ['Gestión de Compras'],
    },
  };

  // 1. 🟢 ESTADO INICIAL AJUSTADO: Se guardan ID, Fecha_Creacion y Estado
  const [roleData, setRoleData] = useState({
    id: rolEdit.id, // ¡CLAVE! ID para el PUT
    nombreRol: rolEdit.nombreRol || '',
    descripcionRol: rolEdit.descripcion || '',
    // Estado NO se incluye en el formulario, pero se necesita en el submit.
    // Lo usaremos desde rolEdit.estado al enviar.
    fecha_Creacion: rolEdit.fecha_Creacion || 'N/A', // ¡CLAVE! Fecha_Creacion para el PUT
  });

  // 2. 🟢 ESTADO DE PERMISOS AJUSTADO: Aplana la lista inicial
  const [permisosSeleccionados, setPermisosSeleccionados] = useState(
    aplanarPermisos(rolEdit.permisos)
  );

  const [menuCollapsed, setMenuCollapsed] = useState(false);

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

  // 3. 🟢 FUNCIÓN SUBMIT AJUSTADA: Llama a la API con todos los datos
  // EditRol.jsx - Función handleSubmit corregida

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rolParaApi = {
          "Id_Rol": roleData.id, 
        "Nombre_Rol": roleData.nombreRol, // Usamos roleData.nombreRol (el valor del input)
        "Descripcion_Rol": roleData.descripcionRol, // Usamos roleData.descripcionRol (el valor del textarea)
        
        // Estado_Rol es un booleano (true/false)
        "Estado_Rol": rolEdit.estado, 
        
        // 🚨 CLAVE: Permisos con 'P' mayúscula para coincidir con el DTO
        "Permisos": permisosSeleccionados, 
    };

    // 🟢 DEPURACIÓN: Muestra el objeto exacto que se envía para verificar en la consola/Network
    console.log('Objeto FINAL a enviar a la API (PUT):', rolParaApi);

    try {
      await updateRol(rolParaApi);

      // Navegar con mensaje de éxito
      navigate('/roles', {
        state: {
          successMessage: `El rol '${rolParaApi.Nombre_Rol}' ha sido actualizado exitosamente.`
        }
      });

    } catch (error) {
      // Manejo de errores más detallado
      console.error('Error al actualizar rol:', error.response?.data || error.message);
      alert(`Error al actualizar el rol: ${error.response?.data?.message || error.message || 'Error desconocido.'}`);
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

          <form onSubmit={handleSubmit} className="role-form">

            {/* Campo Nombre Rol */}
            <div className="form-group">
              <label htmlFor="nombreRol" className="label-heading">
                Nombre del Rol:  <span className="required-asterisk">*</span>
              </label>
              <input
                id="nombreRol"
                name="nombreRol"
                type="text"
                value={roleData.nombreRol}
                onChange={handleChange}
                required
                className="input-field"
              // Deshabilitar la edición del nombre si es un rol base
              //disabled={rolEdit.nombreRol === 'Administrador' || rolEdit.nombreRol === 'Cliente'}
              />
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

            {/* Botones de acción */}
            <div className="form-actions">
              <button type="submit" className="save-button">
                <FaSave style={{ marginRight: '8px' }} /> Actualizar Rol
              </button>
            </div>
            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditRol;