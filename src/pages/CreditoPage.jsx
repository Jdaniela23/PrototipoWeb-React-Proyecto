import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Nav from '../components/Nav.jsx';
import DetallesCredito from '../components/DetallesCredito.jsx';

export default function CreditosPage() {
  const navigate = useNavigate();

  const [creditos, setCreditos] = useState([
    {
      idCredito: 'A01',
      nombreCompleto: 'juan pérez',
      montoCredito: 5000000,
      valorDebe: 3500000,
      cantidadFalta: 1500000,
      fecha_Creacion: '2025-09-10',
      estado: true,
    },
    {
      idCredito: 'A02',
      nombreCompleto: 'maría gómez',
      montoCredito: 3000000,
      valorDebe: 3000000,
      cantidadFalta: 0,
      fecha_Creacion: '2025-09-10',
      estado: false,
    },
    {
      idCredito: 'A03',
      nombreCompleto: 'carlos martínez',
      montoCredito: 4500000,
      valorDebe: 2000000,
      cantidadFalta: 2500000,
      fecha_Creacion: '2025-09-10',
      estado: true,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [creditoSeleccionado, setCreditoSeleccionado] = useState(null);
  const [editandoCredito, setEditandoCredito] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [creditoAEliminar, setCreditoAEliminar] = useState(null);

  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  const filteredCreditos = creditos.filter(credito =>
    Object.values(credito).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleVer = (credito) => setCreditoSeleccionado(credito);

  const handleEditar = (credito, index) => {
    setEditandoCredito({ ...credito });
    setEditIndex(index);
  };

  const guardarEdicion = () => {
    const nuevos = [...creditos];
    nuevos[editIndex] = editandoCredito;
    setCreditos(nuevos);
    setEditandoCredito(null);
    setEditIndex(null);
  };

  const confirmarEliminar = () => {
    if (creditoAEliminar !== null) {
      const nuevos = [...creditos];
      nuevos.splice(creditoAEliminar, 1);
      setCreditos(nuevos);
      setCreditoAEliminar(null);
    }
  };

  return (
    <div className="container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      {/* ⬅️ ¡Aquí se renderiza el modal de detalles! */}
      {creditoSeleccionado && (
        <DetallesCredito credito={creditoSeleccionado} onClose={() => setCreditoSeleccionado(null)} />
      )}

      

   

      <div className={`main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        <div className="header">
          <div className="header-left">
            <h1>Gestión de Créditos</h1>
          </div>
        </div>

        <div className="actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar Créditos"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">
              <FaSearch color="#fff" /> Buscar
            </button>
          </div>

          <Link to='/formcredito' className="add-button" title='editar'>
            <FaPlus style={{ marginRight: '8px' }} />Agregar Crédito
          </Link>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre completo</th>
                <th>Monto crédito</th>
                <th>Valor debe</th>
                <th>Cantidad falta</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCreditos.map((c, index) => (
                <tr key={index}>
                  <td>{c.nombreCompleto}</td>
                  <td>{c.montoCredito.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                  <td>{c.valorDebe.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                  <td>{c.cantidadFalta.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={c.estado}
                        onChange={() => {
                          const nuevos = [...creditos];
                          nuevos[index].estado = !nuevos[index].estado;
                          setCreditos(nuevos);
                        }}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td className="icons">
                    <button className="icon-button black" title="ver detalles" onClick={() => handleVer(c)}><FaEye /></button>
                    <Link to='/creditosedit' className="icon-button blue" title='editar'>
                      <FaEdit />
                    </Link>


                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}