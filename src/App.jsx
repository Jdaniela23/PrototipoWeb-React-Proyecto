import './App.css'
import { Routes, Route } from 'react-router-dom';

// ¡Componentes!
import LoginForm from './components/LoginForm';
import LoadingPage from './components/LoadingPage';
import RecuperarPass from './pages/RecuperarPass';
import Home from './pages/HomePage';
import RecuperarPassConfirmacion from './pages/ConfirmarPass';
import RestablecerContrasena from './pages/RestablecerPass';
import Nav from './components/Nav';
import UsuariosPage from './pages/UsuariosPage';
import RolesPage from './pages/RolesPage';
import ProductosPage from './pages/ProductosPage';

import FormAdd from './pages/FormAddRol';
import FormAddUser from './pages/FormAddUser';
import FormAddProducts from './pages/FormAddProduct';
import Footer from './components/Footer';
import CreactCount from './pages/CreateCount';
import Detalles from './components/Detalles';
import DetallesUser from './components/DetallesUser';
import DetallesRol from './components/DetallesRol';
import EditRol from './pages/EditRol';
import EditProducto from './pages/EditProducto';
import EditUsuario from './pages/EditUsuario';
import DeleteRol from './pages/DeleteRol';
import DeleteProducts from './pages/DeleteProductos';
import DeleteUser from './pages/DeleteUsuarios';
import Dashboard from './pages/Dashboard';
import ProveedoresForm from './pages/Proveedores';
import ComprasForm from './pages/Compras';
import CategoriasPage from './pages/CategoriasPage';
import PedidosPageA from './pages/PedidosPage';
import FormPedido from './pages/FormPedido';
import NuevaCompraPage from './pages/Comprasform';
import CreateProveedor from './pages/ProveedoresForm';

import DetallesCompras from './components/DetallesCompras';
import EditarPedido from './pages/EditPedido';
import EditarCategoria from './pages/EditarCategoria';
import DetallesPedido from './components/DetallesPedido';
import DetallesCategoria from './components/DetallesCategoria';
import EditPerfil from './pages/EditperfilAdmin';
import AjustesAdmin from './pages/AjustesAdmin';
import Notificaciones from './pages/Notificaciones';
import OtrosAjustes from './pages/OtrosAjustes';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import FeaturedProducts from './components/FeaturedProducts';
import About from './pages/quienessomos';
import TallasPage from './pages/Tallas';
import ColoresPage from './pages/Color';
import CustomerPage from './pages/customers/CustomerPage';
import CambiarPasswordPage from './pages/customers/CambiarPasswordPage';
import EditarPerfilPage from './pages/customers/EditarPerfilPage';
import CrearCategoria from './pages/CrearCategoria';
import EditarProveedor from './pages/Proveedoresedit';
import FormAddTalla from './pages/FormAddTalla';
import FormAddColor from './pages/FormAddColor';
import DeleteTalla from './pages/DeleteTallas';
import DeleteColor from './pages/DeleteColor';
import EditColor from './pages/EditColor';
import EditTalla from './pages/EditTalla';
import DetallesColor from './components/DetallesColor';
import DetallesTalla from './components/DetallesTalla';
import Store from './pages/store/Store';
import ProductsShop from './pages/ProductsShop';
import NavHome from './components/Navhome';

import VentasPage from './pages/VentasPage';


function App() {
  return (
    <div className="App-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/navegador" element={<Nav />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path='/recuperar' element={<RecuperarPass />} />
        <Route path='/confirmar' element={<RecuperarPassConfirmacion />} />
        <Route path='/restablecer' element={<RestablecerContrasena />} />
        <Route path='/editperfilAdmin' element={<EditPerfil />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/usuarios' element={<UsuariosPage />} />
        <Route path='/roles' element={<RolesPage />} />
        <Route path='/productos' element={<ProductosPage />} />
        <Route path='/formroles' element={<FormAdd />} />
        <Route path='/formuser' element={<FormAddUser />} />
        <Route path='/formproduct' element={<FormAddProducts />} />
        <Route path='/footer' element={<Footer />} />
        <Route path='/crearcuenta' element={<CreactCount />} />
        <Route path='/modal' element={<Detalles />} />
        <Route path='/modalUsuario' element={<DetallesUser />} />
        <Route path='/modalRol' element={<DetallesRol />} />
        <Route path='/editarRol' element={<EditRol />} />
        <Route path='/editarProducto' element={<EditProducto />} />
        <Route path='/editarUsuario' element={<EditUsuario />} />
        <Route path='/eliminarRol' element={<DeleteRol />} />
        <Route path="/editarCategoria/:id" element={<EditarCategoria />} />
        <Route path='/eliminarProducto' element={<DeleteProducts />} />
        <Route path='/eliminarUsuario' element={<DeleteUser />} />
        <Route path='/proveedores' element={<ProveedoresForm />} />
        <Route path='/compras' element={<ComprasForm />} />
        <Route path='/comprasform' element={<NuevaCompraPage />} />
        <Route path='/createproveedores' element={<CreateProveedor />} />
        <Route path='/proovedoresedit' element={<EditarProveedor />} />
        <Route path='/detalleCompra' element={<DetallesCompras />} />
        <Route path='/ajustesAdmin' element={<AjustesAdmin />} />
        <Route path='/notificaciones' element={<Notificaciones />} />
        <Route path='/otrosAjustes' element={<OtrosAjustes />} />
        <Route path='/categorias' element={<CategoriasPage />} />
        <Route path='/pedidos' element={<PedidosPageA />} />
        <Route path='/crearcategoria' element={<CrearCategoria />} />
        <Route path='/crearpedidos' element={<FormPedido />} />
        <Route path="/editpedido/:id" element={<EditarPedido />} />
        <Route path='/detallecategoria' element={<DetallesCategoria />} />
        <Route path='/detallepedido' element={<DetallesPedido />} />
        <Route path="/productosdestacados" element={< FeaturedProducts />} />
        <Route path="/quienessomos" element={< About />} />
        <Route path="/tallas" element={< TallasPage />} />
        <Route path="/colores" element={< ColoresPage />} />
        <Route path="/editarcustomers" element={< EditarPerfilPage />} />
        <Route path="/passcustomers" element={< CambiarPasswordPage />} />
        <Route path='/editproveedor/:id' element={<EditarProveedor />} />
        <Route path='/createtalla' element={<FormAddTalla />} />
        <Route path='/createcolor' element={<FormAddColor />} />
        <Route path='/deletecolor' element={<DeleteColor />} />
        <Route path='/deletetalla' element={<DeleteTalla />} />
        <Route path='/edittalla/:id' element={<EditTalla />} />
        <Route path='/editcolor/:id' element={<EditColor />} />
        <Route path='/detalletalla/:id' element={<DetallesTalla />} />
        <Route path='/detallecolor/:id' element={<DetallesColor />} />
        <Route path ='/shop' element={<ProductsShop/>}/>
        <Route path='/navhome' element={<NavHome/>}/>
        <Route path='/ventas' element={<VentasPage/>}/>

        {/* ⭐ Rutas protegidas ⭐ */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pagecustomers" element={<CustomerPage />} />
          <Route path="/tienda" element={<Store />} />


        </Route>

        <Route path="*" element={<div>Página no encontrada</div>} />
      </Routes>

    </div>
  );
}

export default App;
