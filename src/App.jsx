import './App.css' // Deja esta línea si usas App.css, si no, quítala.
import { Routes, Route } from 'react-router-dom'; // Asegúrate de importar Routes y Route y useLocation para el modal

// ¡Estos son tus componentes!
import LoginForm from './components/LoginForm';
import PedidosPage from './pages/AdminPage';
import LoadingPage from './components/LoadingPage'; // Importa la nueva página de carga
import RecuperarPass from './pages/RecuperarPass'; //Importamos siempre componentes o paginas que necesitamos en rutar o navegar
import Home from './pages/HomePage';
import RecuperarPassConfirmacion from './pages/ConfirmarPass';
import RestablecerContrasena from './pages/RestablecerPass';
import Nav from './components/Nav';
import UsuariosPage from './pages/UsuariosPage';
import RolesPage from './pages/RolesPage';
import ProductosPage from './pages/ProductosPage';
import ProfileCard from './components/ProfileCard';
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
import CreditoPage from './pages/CreditoPage';
import PedidosPageA from './pages/PedidosPage';
import FormCategoria from './pages/FormCategoria';
import FormPedido from './pages/FormPedido';
import FormCredito from './pages/FormCredito';
import NuevaCompraPage from './pages/Comprasform';
import CreateProveedor from './pages/ProveedoresForm';
import EditarProveedor from './pages/Proveedoresedit';
import DetallesCompras from './components/DetallesCompras';
import EditarPedido from './pages/EditPedido';
import EditarCategoria from './pages/EditarCategoria';
import DetallesPedido from './components/DetallesPedido';
import CategoriaForm from './pages/Categoriasform';
import CreditosEdit from './pages/CreditosEdit';
import Formcredito from './pages/FormCredito';
import DetallesCategoria from './components/DetallesCategoria';
import EditPerfil from './pages/EditperfilAdmin';
import AjustesAdmin from './pages/AjustesAdmin';
import Notificaciones from './pages/Notificaciones';
import OtrosAjustes from './pages/OtrosAjustes';


function App() {


  return (
    <div className="App-container"> {/* Este div es el contenedor principal */}
      {/* Se puede poner el Nav o Footer aquí si quieres que aparezcan en todas las rutas */}
      {/* <Navbar /> */}

      {/* Las rutas deben estar envueltas siempre en: <Routes> */}
      <Routes>
        {/* La ruta por defecto, cuando la URL es "/" osea que es lo prinicipal que se ve al iniciar la app el Home */}
        <Route path="/" element={<Home />} />

        <Route path="/navegador" element={<Nav />} />
        <Route path="/loading" element={<LoadingPage />} /> {/* Nueva ruta para la página de carga */}


        <Route path="/panelAdmin" element={<PedidosPage />} />
        <Route path='/recuperar' element={<RecuperarPass />} /> {/*Ruta para navegar a recuperar contraseña*/}
        <Route path='/confirmar' element={<RecuperarPassConfirmacion />} />
        <Route path='/restablecer' element={<RestablecerContrasena />} />
        <Route path='/editperfilAdmin' element={<EditPerfil />} />

        <Route path='/login' element={<LoginForm />} />
        <Route path='/usuarios' element={<UsuariosPage />} />
        <Route path='/roles' element={<RolesPage />} />
        <Route path='/productos' element={<ProductosPage />} />
        <Route path='/card' element={<ProfileCard />} />
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
        <Route path="/editarcategoria" element={<EditarCategoria />} />
        <Route path='/eliminarProducto' element={<DeleteProducts />} />
        <Route path='/eliminarUsuario' element={<DeleteUser />} />
        <Route path='/dashboard' element={<Dashboard />} />
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
        <Route path='/creditos' element={<CreditoPage />} />
        <Route path='/pedidos' element={<PedidosPageA />} />
        <Route path='/crearcategoria' element={<FormCategoria />} />
        <Route path='/crearpedidos' element={<FormPedido />} />
        <Route path='/crearcreditos' element={<FormCredito />} />
        <Route path='/editpedido' element={<EditarPedido />} />
        <Route path='/categoriasedit' element={<CategoriaForm />} />
        <Route path='/creditosedit' element={<CreditosEdit />} />
        <Route path='/formcredito' element={<Formcredito />} />
        <Route path='/detallecategoria' element={<DetallesCategoria />} />
        <Route path='/detallepedido' element={<DetallesPedido />} />

        {/* Si pones un <h1>hola</h1> fuera de las rutas, se verá en todas las páginas.
            Si quieres que solo se vea en el login, ponlo dentro de LoginForm.jsx
            o dentro del element de la ruta raíz:
            <Route path="/" element={
                <>
                  <h1>hola</h1>
                  <LoginForm />
                </>
            } />
        */}
      </Routes>

      {/* <Footer /> */}
    </div>
  );
}

export default App;