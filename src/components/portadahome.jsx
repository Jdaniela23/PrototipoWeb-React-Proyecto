import PortadaImg from '../assets/img/portada.jpg';

function PortadaComponent() {
    const fondoStyle = {
        backgroundImage: `url(${PortadaImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '630px',


        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    return (
        <div className="container-fotoportada" style={fondoStyle}>
            <h1 style={{
                color: 'white',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                fontSize: '3em',
                textAlign: 'center',
                textShadow: `
                    2px 2px 4px rgba(0, 0, 0, 0.7), /* Sombra oscura original para contraste */
                    0px 5px 10px rgba(207, 181, 30, 0.8), /* Sombra dorada ligeramente abajo, con desenfoque */
                    0px 8px 15px rgba(207, 181, 30, 0.6), /* Otra capa de sombra dorada más abajo y más extendida */
                    0px 10px 20px rgba(207, 181, 30, 0.4) /* Otra capa, más difusa */
                `
         
            }}>
                𝓛𝓪 𝓶𝓸𝓭𝓪 𝓺𝓾𝓮 𝓽𝓮 𝓱𝓪𝓬𝓮 𝓫𝓻𝓲𝓵𝓵𝓪𝓻...
            </h1>
         
        </div>
    )
}

export default PortadaComponent;