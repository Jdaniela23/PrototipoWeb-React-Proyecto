import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaEye, FaEdit } from 'react-icons/fa';
import Nav from '../components/Nav.jsx';
import DetallesPedido from '../components/DetallesPedido'; 
function PedidosPageA() {
  const navigate = useNavigate();

  const pedidosData = [
    {
      idPedido: 'PED001',
      fecha: '2025-06-01',
      documentoCliente: '123456789',
      metodoPago: 'efectivo',
      domicilio: 'sí',
      estadoPago: 'en proceso',
      productos: [
        { id: 1, nombre: 'Camiseta Negra', cantidad: 2, precio: 30000 },
        { id: 2, nombre: 'Pantalón Jean', cantidad: 1, precio: 80000 }
      ],
      subtotal: 140000,
      iva: 26600,
      totalCompra: 166600
    },
    {
      idPedido: 'PED002',
      fecha: '2025-06-03',
      documentoCliente: '987654321',
      metodoPago: 'transferencia',
      domicilio: 'no',
      estadoPago: 'pagado',
      productos: [
        { id: 3, nombre: 'Sudadera Gris', cantidad: 1, precio: 50000 }
      ],
      subtotal: 50000,
      iva: 9500,
      totalCompra: 59500
    },
  ];

  const [pedidos, setPedidos] = useState(pedidosData);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [pedidoDetalle, setPedidoDetalle] = useState(null);
  const [pedidoEditando, setPedidoEditando] = useState(null);
  const [pedidoEliminar, setPedidoEliminar] = useState(null);

  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  const filteredPedidos = pedidos.filter(p =>
    p.fecha.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.documentoCliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNavegarAEditar = (pedido) => {
    navigate('/editpedido', { state: { pedido } });
  };

  const guardarEdicion = () => {
    setPedidos(prev =>
      prev.map(p =>
        p.documentoCliente === pedidoEditando.documentoCliente ? pedidoEditando : p
      )
    );
    setPedidoEditando(null);
  };

  const handleEliminar = (pedido) => setPedidoEliminar(pedido);

  const confirmarEliminar = () => {
    setPedidos(prev => prev.filter(p => p.documentoCliente !== pedidoEliminar.documentoCliente));
    setPedidoEliminar(null);
  };

  return (
    <div className="container lowercase">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
      <div className={`main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        <div className="header">
          <h1>Gestión de Pedidos</h1>
        </div>

        <div className="actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar por Fecha o Número de Documento"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">
              <FaSearch color="#fff" /> Buscar
            </button>
          </div>

          <button className="add-button" onClick={() => navigate('/crearpedidos')}>
            <FaPlus style={{ marginRight: '8px' }} />
            Agregar Pedido
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Pedido ID</th>
                <th>Fecha</th>
                <th>Documento</th>
                <th>Método<br /> de pago</th>
                <th>Requiere <br />domicilio</th>
                <th>Estado <br />de pago</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPedidos.map(pedido => (
                <tr key={pedido.documentoCliente}>
                  <td>{pedido.idPedido}</td>
                  <td>{pedido.fecha}</td>
                  <td>{pedido.documentoCliente}</td>
                  <td>{pedido.metodoPago}</td>
                  <td>{pedido.domicilio}</td>
                  <td>{pedido.estadoPago}</td>
                  <td className="icons">
                    <button
                      className="icon-button black"
                      title="ver detalles"
                      onClick={() => setPedidoDetalle(pedido)}
                    >
                      <FaEye />
                    </button>
                    <button className="icon-button blue" title="editar" onClick={() => handleNavegarAEditar(pedido)}>
                      <FaEdit />
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ➡️ Renderización condicional del modal de detalles */}
      {pedidoDetalle && <DetallesPedido pedido={pedidoDetalle} onClose={() => setPedidoDetalle(null)} />}
    </div>
  );
}

export default PedidosPageA;