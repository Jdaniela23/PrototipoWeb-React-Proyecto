import React, { useState } from 'react';
import { FaEye, FaTrash, FaPlus, FaEdit, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import DetallesProveedor from '../components/DetallesProveedor.jsx';
import './UsuariosPage.css';

const ProveedoresPage = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  const [proveedores, setProveedores] = useState([
    {
      id: 1,
      idProveedor: 'P-001',
      nombreRepresentante: 'Carlos',
      apellidoRepresentante: 'Gómez',
      numeroContacto: '3101234567',
      tipoDocumento: 'CC',
      numeroDocumento: '123456789',
      correoElectronico: 'carlos.gomez@proveedor.com',
      estado: 'Activo',
      municipio: 'Bogotá',
      direccion: 'Calle 123 #45-67',
      img: 'https://placehold.co/150x150/E0BBE4/FFFFFF?text=Prov1',
      fecha_Creacion: '2025-07-20'
    },
    {
      id: 2,
      idProveedor: 'P-002',
      nombreRepresentante: 'María',
      apellidoRepresentante: 'Rodríguez',
      numeroContacto: '3209876543',
      tipoDocumento: 'NIT',
      numeroDocumento: '987654321',
      correoElectronico: 'maria.rodriguez@empresa.com',
      estado: 'Inactivo',
      municipio: 'Medellín',
      direccion: 'Carrera 56 #12-34',
      img: 'https://placehold.co/150x150/957DAD/FFFFFF?text=Prov2',
      fecha_Creacion: '2025-07-20'
    },
    {
      id: 3,
      idProveedor: 'P-003',
      nombreRepresentante: 'Carlos',
      apellidoRepresentante: 'Mendez',
      numeroContacto: '3113661189',
      tipoDocumento: 'CC',
      numeroDocumento: '64278390',
      correoElectronico: 'Calintos.Mendez@empresa.com',
      estado: 'Activo',
      municipio: 'Medellín',
      direccion: 'Carrera 56 #12-34',
      img: 'https://placehold.co/150x150/D291BC/FFFFFF?text=Prov3',
      fecha_Creacion: '2025-07-20'
    }
  ]);

  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null); // Cambié el nombre de la variable de estado para mayor claridad
  const [searchTerm, setSearchTerm] = useState('');

  const cambiarEstadoProveedor = (id) => {
    setProveedores(proveedores.map(proveedor =>
      proveedor.id === id ? {
        ...proveedor,
        estado: proveedor.estado === 'activo' ? 'inactivo' : 'activo'
      } : proveedor
    ));
  };

  const verDetalles = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    // Prevenir el scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  };

  const cerrarModal = () => {
    setProveedorSeleccionado(null);
    // Restaurar el scroll del body cuando el modal se cierra
    document.body.style.overflow = 'auto';
  };

  const filteredProveedores = proveedores.filter(proveedor =>
    Object.values(proveedor).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        <div className="header">
          <div className="header-left">
            <h1>Gestión de Proveedores</h1>
          </div>
        </div>

        <div className="actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar Proveedor"
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">
              <FaSearch color="#fff" /> Buscar
            </button>
          </div>

          <Link to='/createproveedores' className="add-button">
            <FaPlus style={{ marginRight: '8px', color: "#fff" }} /> Agregar Proveedor
          </Link>
        </div>

        <div className="table-container">
          <div className="table-wrapper">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID Proveedor</th>
                  <th>Representante</th>
                  <th>Contacto</th>
                  <th>Documento</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProveedores.length > 0 ? (
                  filteredProveedores.map((proveedor) => (
                    <tr key={proveedor.id}>
                      <td>{proveedor.idProveedor}</td>
                      <td>{proveedor.nombreRepresentante} {proveedor.apellidoRepresentante}</td>
                      <td>{proveedor.numeroContacto}</td>
                      <td>{proveedor.tipoDocumento}: {proveedor.numeroDocumento}</td>
                      <td>
                        <span className={`badge ${proveedor.estado === 'activo' ? 'bg-success' : 'bg-danger'}`}>
                          {proveedor.estado}
                        </span>
                      </td>
                      <td className="icons">

                        <FaEye />
                        <button
                          className="icon-button black"
                          onClick={() => verDetalles(proveedor)}
                          title="Ver detalles"
                        >
                          <FaEye />
                        </button>

                        <Link to='/proovedoresedit' className="icon-button blue" title='editar'>
                          <FaEdit />
                        </Link>
                        <button
                          className="icon-button red"
                          onClick={() => cambiarEstadoProveedor(proveedor.id)}
                          title={proveedor.estado === 'activo' ? 'Desactivar' : 'Activar'}
                        >
                          {proveedor.estado === 'activo' ? <FaTrash /> : <FaPlus />}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                      No se encontraron proveedores que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ⬅️ Aquí usamos el componente de modal de detalles en su lugar */}
        {proveedorSeleccionado && <DetallesProveedor proveedor={proveedorSeleccionado} onClose={cerrarModal} />}
      </div>
    </div >
  );
};

export default ProveedoresPage;