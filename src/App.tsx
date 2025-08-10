import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

// Interfaz para el clima
interface Clima {
    main?: {
        temp?: number;
    };
    weather?: Array<{
        description?: string;
    }>;
}

// Interfaz para las imágenes
interface Imagen {
    id: string;
    urls: {
        small: string;
    };
    alt_description: string;
}

function App() {
    const [imagenes, setImagenes] = useState<Imagen[]>([]); // Estado para almacenar imágenes
    const [keyword, setKeyword] = useState(''); // Estado para la palabra clave de búsqueda
    const [clima, setClima] = useState<Clima>({}); // Estado para almacenar datos del clima
    const [ciudad, setCiudad] = useState('Chihuahua'); // Ciudad por defecto
    const [ubicacion, setUbicacion] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null }); // Estado para la ubicación

    // Función para buscar imágenes
    const buscarImagenes = () => {
        axios.get(`/api/imagenes/${keyword}`)
            .then(response => setImagenes(response.data.results))
            .catch(error => console.error('Error en el frontend:', error));
    };

    // Función para obtener el clima
    const obtenerClima = () => {
    console.log(`Buscando clima para la ciudad: ${ciudad}`); // Agregar este log
    axios.get(`/api/clima/${ciudad}`)
        .then(response => {
            console.log(response.data); // Agregar este log para ver la respuesta
            setClima(response.data);
        })
        .catch(error => console.error("Error al obtener el clima:", error));
};

    useEffect(() => {
        buscarImagenes(); // Llama a la función para buscar imágenes
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUbicacion({ lat: latitude, lng: longitude }); // Establece la ubicación
                },
                (error) => console.error("Error obteniendo la ubicación: ", error)
            );
        }
    }, [keyword, ciudad]); // Dependencias para el efecto

    return (
        <div className="app-container">
            <div className="info-container">
                <h1>Clima en {ciudad}</h1>
                <p>Temperatura: {clima.main?.temp} °C</p>
                <p>Condiciones: {clima.weather?.[0]?.description}</p>
                <input 
                    type="text" 
                    value={ciudad} 
                    onChange={(e) => setCiudad(e.target.value)} 
                    placeholder="Ingresa una ciudad" 
                    className="input-ciudad"
                />
                <button onClick={obtenerClima} className="boton-obtener">Obtener Clima</button>
                <h1>Ubicación Actual</h1>
                <p>Latitud: {ubicacion.lat}</p>
                <p>Longitud: {ubicacion.lng}</p>
            </div>

            <input 
                type="text" 
                value={keyword} 
                onChange={(e) => setKeyword(e.target.value)} 
                placeholder="Buscar imágenes..." 
                className="search-input"
            />
            <button onClick={buscarImagenes} className="search-button">Buscar</button>
            <div className="image-container"> 
                {imagenes.length > 0 ? (
                    imagenes.map(img => (
                        <img key={img.id} src={img.urls.small} alt={img.alt_description} className="image" />
                    ))
                ) : (
                    <p>Cargando imágenes...</p>
                )}
            </div>
        </div>
    );
}

export default App;
