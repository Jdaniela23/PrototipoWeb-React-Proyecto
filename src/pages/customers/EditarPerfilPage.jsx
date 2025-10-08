import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, updateMyProfile, getBarrios } from '../../api/authService';
import Nav from '../../components/customer/Nav';
import TopBar from '../../components/customer/TopBar';
import './EditarPerfilPage.css';
import { FaUserCircle, FaLock } from 'react-icons/fa';

function EditarPerfilPage() {
    const [profile, setProfile] = useState({
        nombreCompleto: '',
        apellido: '',
        nombreUsuario: '',
        email: '',
        numeroContacto: '',
        documento: '',
        tipo_Documento: '',
        direccion: '',
        id_Barrio: '',
        foto: '', // URL de Cloudinary (foto actual guardada)
        fotoPreview: null // URL temporal para la vista previa del nuevo archivo
    });

    // Estado para guardar el objeto 'File' binario
    const [newFile, setNewFile] = useState(null); 
    
    const [barrios, setBarrios] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const navigate = useNavigate();

    const tipoDocumentoOptions = [
        { value: 'CC', label: 'Cédula de Ciudadanía' },
        { value: 'TI', label: 'Tarjeta de Identidad' },
        { value: 'CE', label: 'Cédula de Extranjería' },
    ];

    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileData = await getMyProfile();

                profileData.tipo_Documento = profileData.tipo_Documento || '';
                // Asegurar que id_Barrio se guarde como string para el <select>
                profileData.id_Barrio = profileData.id_Barrio ? String(profileData.id_Barrio) : ''; 

                setProfile(prev => ({ 
                    ...prev, 
                    ...profileData, 
                    foto: profileData.foto || '' 
                }));

                const barriosData = await getBarrios();
                setBarrios(barriosData);
            } catch (err) {
                console.error('Error cargando perfil o barrios:', err);
                // Aquí puedes redirigir a login si el error es 401 (Unauthorized)
            }
        };
        fetchData();

        // Limpieza de URLs temporales: crucial para evitar fugas de memoria
        return () => {
            if (profile.fotoPreview && profile.fotoPreview.startsWith('blob:')) {
                URL.revokeObjectURL(profile.fotoPreview);
            }
        };
    }, []);

    const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        
        // Revocar URL anterior si existe una temporal
        if (profile.fotoPreview && profile.fotoPreview.startsWith('blob:')) {
            URL.revokeObjectURL(profile.fotoPreview);
        }

        if (!file) {
            setNewFile(null);
            setProfile(p => ({ ...p, fotoPreview: null }));
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            alert('Solo se permiten imágenes JPEG o PNG.');
            e.target.value = null; // Limpiar el input file
            setNewFile(null);
            setProfile(p => ({ ...p, fotoPreview: null }));
            return;
        }
        
        // Almacenamos el objeto File y generamos una URL temporal única.
        setNewFile(file); 
        setProfile(p => ({ 
            ...p, 
            fotoPreview: URL.createObjectURL(file) 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const formData = new FormData();
            
            // 🛑 CRÍTICO: Asegurarse que las claves coincidan con el DTO de C# (PascalCase)
            if (newFile) {
                formData.append('File', newFile); // DTO: public IFormFile File { get; set; }
            }

            // Datos de texto
            formData.append('NombreCompleto', profile.nombreCompleto || '');
            formData.append('Apellido', profile.apellido || '');
            formData.append('NombreUsuario', profile.nombreUsuario || ''); // DTO: public string NombreUsuario { get; set; }
            formData.append('Email', profile.email || '');
            formData.append('NumeroContacto', profile.numeroContacto || '');
            formData.append('Documento', profile.documento || '');
            
            // ⭐ IMPORTANTE: Usar el nombre exacto de la propiedad en el DTO (ej. Tipo_Documento o TipoDocumento)
            formData.append('Tipo_Documento', profile.tipo_Documento || ''); 

            formData.append('Direccion', profile.direccion || '');
            
            // Enviar el ID del barrio, que es lo que el DTO debería esperar
            formData.append('Id_Barrio', profile.id_Barrio || ''); 

            await updateMyProfile(formData); 
            
            setSuccessMsg('Perfil actualizado correctamente ✅');
            
            // Recargar para obtener la nueva URL de Cloudinary (foto actualizada)
            const updatedProfileData = await getMyProfile();
            
            // Limpiar el preview y file, y actualizar 'foto' con la nueva URL
            if (profile.fotoPreview && profile.fotoPreview.startsWith('blob:')) {
                URL.revokeObjectURL(profile.fotoPreview);
            }

            setProfile(prev => ({ 
                ...prev, 
                ...updatedProfileData, 
                foto: updatedProfileData.foto || '',
                fotoPreview: null // Aseguramos que la vista previa se borre
            }));
            setNewFile(null); 
            
            setTimeout(() => navigate('/pagecustomers'), 1000);
        } catch (err) {
            console.error('Error al actualizar perfil:', err);
            const errorMsg = err.response?.data?.message || err.message || 'Error desconocido al actualizar el perfil.';
            alert(`Error al actualizar el perfil: ${errorMsg}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={`page-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <Nav menuCollapsed={isSidebarCollapsed} toggleMenu={toggleSidebar} />
            <div className="content-wrapper">
                {/* La TopBar muestra la foto URL guardada o la predeterminada */}
                <TopBar userName={profile.nombreUsuario || 'Cliente'} foto={profile.foto} /> 

                <div className="editar-perfil-content centered-container">
                    <h2 className='titulo-editperfil'>Editar Perfil <FaUserCircle/> </h2>
                    <p className='parrafo-customer'>Modifica la información que desees para mantener tu perfil actualizado:✅</p>
                    <div className="form-photo-wrapper">
                        <form onSubmit={handleSubmit} className="editar-perfil-form">
                            <div className="form-row">
                                <label>Nombre</label>
                                <input type="text" name="nombreCompleto" value={profile.nombreCompleto} onChange={handleChange} required />
                            </div>
                            <div className="form-row">
                                <label>Apellido</label>
                                <input type="text" name="apellido" value={profile.apellido} onChange={handleChange} required />
                            </div>
                            <div className="form-row">
                                <label>Usuario</label>
                                <input type="text" name="nombreUsuario" value={profile.nombreUsuario} onChange={handleChange} required />
                            </div>
                            <div className="form-row">
                                <label>Email</label>
                                <input type="email" name="email" value={profile.email} onChange={handleChange} required />
                            </div>
                            <div className="form-row">
                                <label>Teléfono</label>
                                <input type="text" name="numeroContacto" value={profile.numeroContacto} onChange={handleChange} />
                            </div>
                            <div className="form-row">
                                <label>Documento</label>
                                <input type="text" name="documento" value={profile.documento} onChange={handleChange} />
                            </div>
                            <div className="form-row">
                                <label>Tipo de Documento</label>
                                <select name="tipo_Documento" value={profile.tipo_Documento} onChange={handleChange}>
                                    <option value="">Selecciona tipo</option>
                                    {tipoDocumentoOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </div>
                            <div className="form-row">
                                <label>Dirección</label>
                                <input type="text" name="direccion" value={profile.direccion} onChange={handleChange} />
                            </div>
                            <div className="form-row">
                                <label>Barrio</label>
                                <select name="id_Barrio" value={profile.id_Barrio} onChange={handleChange}>
                                    <option value="">Selecciona un barrio</option>
                                    {barrios.map(b => <option key={b.id} value={String(b.id)}>{b.nombre}</option>)}
                                </select>
                            </div>
                            <div className="form-row">
                                <label>Foto</label>
                                <input type="file" accept="image/*" onChange={handleFileChange} />
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => navigate('/passcustomers')} className="btn-secondary">
                                    Cambiar contraseña <FaLock/>
                                </button>
                                <button type="submit" disabled={isSaving} className="btn-primary">
                                    {isSaving ? 'Guardando...' : 'Guardar cambios '}
                                </button>
                            </div>
                        </form>

                        <div className="photo-preview-wrapper">
                            {/* Muestra la vista previa si hay un nuevo archivo seleccionado */}
                            {profile.fotoPreview ? (
                                <img src={profile.fotoPreview} alt="Preview" className="foto-preview-large" />
                            ) : (
                                // Muestra la foto actual si no hay preview
                                profile.foto && <img src={profile.foto} alt="Actual Profile" className="foto-preview-large" />
                            )}
                        </div>
                    </div>

                    {successMsg && <p className="success-message">{successMsg}</p>}
                </div>
            </div>
        </div>
    );
}

export default EditarPerfilPage;