const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors()); // Habilita CORS para permitir solicitudes desde el frontend

// Ruta para obtener imágenes de Unsplash
app.get('/api/imagenes/:keyword', async (req, res) => {
    try {
        const keyword = req.params.keyword;
        const apiKey = process.env.REACT_APP_UNSPLASH_API_KEY; // Usa la clave de API desde el archivo .env
        const respuesta = await axios.get(`https://api.unsplash.com/search/photos`, {
            params: {
                query: keyword,
                client_id: apiKey,
                per_page: 10
            }
        });
        res.json(respuesta.data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener imágenes', details: error.message });
    }
});

// Ruta para obtener clima de OpenWeather
app.get('/api/clima/:ciudad', async (req, res) => {
    const ciudad = req.params.ciudad;
    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY; // Usa la clave de API desde el archivo .env
    console.log(`Buscando clima para la ciudad: ${ciudad}`); // Agregar este log
    try {
        const respuesta = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric`);
        console.log(respuesta.data); // Agregar este log para ver la respuesta
        res.json(respuesta.data);
    } catch (error) {
        console.error("Error al obtener el clima:", error); // Log del error
        res.status(error.response.status).json({ message: error.message });
    }
});


const PORT = process.env.PORT || 5000; // Puerto del servidor
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
