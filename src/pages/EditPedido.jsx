import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave } from 'react-icons/fa';
import { getPedidoById, updatePedido } from '../api/pedidosService';
import './Page.css';

//EDITAR PEDIDO
export default function EditarPedido() {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtener ID desde la URL

  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const toggleMenu = () => setMenuCollapsed(!menuCollapsed);

  // 🔥 Cargar el pedido desde la API al montar el componente
  useEffect(() => {
    const fetchPedido = async () => {
      try {
        setLoading(true);
        const data = await getPedidoById(id);
        setPedido(data);
      } catch (error) {
        console.error('Error al cargar pedido:', error);
        alert('Error al cargar el pedido');
        navigate('/pedidos');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPedido();
    } else {
      navigate('/pedidos');
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPedido({ ...pedido, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);

      // 🔥 El backend solo acepta estos dos campos
      const pedidoActualizado = {
        id_Pedido: pedido.id_Pedido,
        estado_Pedido: pedido.estado_Pedido
      };

      await updatePedido(id, pedidoActualizado);
      
      alert('✅ Pedido actualizado correctamente');
      navigate('/pedidos');
      
    } catch (error) {
      console.error('Error al actualizar pedido:', error);
      alert('❌ Error al actualizar el pedido. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  // Mostrar loading mientras carga
  if (loading) {
    return (
      <div className="role-form-container">
        <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />
        <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
          <div className="formulario-roles">
            <p>Cargando pedido...</p>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay pedido, no renderizar nada
  if (!pedido) return null;

  return (
    <div className="role-form-container">
      <Nav menuCollapsed={menuCollapsed} toggleMenu={toggleMenu} />

      <div className={`formulario-rol-main-content-area ${menuCollapsed ? 'expanded-margin' : ''}`}>
        <div className="formulario-roles">
          <h1 className="form-title">Editar Estado del Pedido</h1>
          <p className="form-info">Solo puedes modificar el estado del pedido 📝</p>
          <br /><br />

          <form onSubmit={handleSubmit} className="role-form">
            {/* ID del Pedido - Solo lectura */}
            <div className="form-group">
              <label htmlFor="id_Pedido" className="label-heading">
                ID del Pedido:
              </label>
              <input
                type="text"
                id="id_Pedido"
                value={pedido.id_Pedido || ''}
                disabled
                className="input-field"
              />
            </div>

            {/* Cliente */}
            <div className="form-group">
              <label htmlFor="cliente" className="label-heading">
                Cliente:
              </label>
              <input
                type="text"
                id="cliente"
                value={pedido.usuario?.nombre_Completo || 'N/A'}
                disabled
                className="input-field"
              />
            </div>

            {/* Total */}
            <div className="form-group">
              <label htmlFor="total" className="label-heading">
                Total:
              </label>
              <input
                type="text"
                id="total"
                value={`$${pedido.total_Pedido?.toLocaleString() || 0}`}
                disabled
                className="input-field"
              />
            </div>

            {/* Estado del Pedido - EDITABLE */}
            <div className="form-group">
              <label htmlFor="estado_Pedido" className="label-heading">
                Estado del Pedido: <span style={{ color: 'red' }}>*</span>
              </label>
              <select
                id="estado_Pedido"
                name="estado_Pedido"
                value={pedido.estado_Pedido || ''}
                onChange={handleChange}
                required
                className="barrio-select"
              >
                <option value="">Selecciona estado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En proceso">En proceso</option>
                <option value="Completado">Completado</option>
                <option value="Entregado">Entregado</option>
                <option value="Anulado">Anulado</option>
              </select>
            </div>

            {/* Botones */}
            <div className="form-buttons">
              <button 
                type="button" 
                className="cancel-button" 
                onClick={() => navigate('/pedidos')}
                disabled={saving}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="save-button"
                disabled={saving}
              >
                <FaSave style={{ marginRight: '8px' }} />
                {saving ? 'Guardando...' : 'Actualizar pedido'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}