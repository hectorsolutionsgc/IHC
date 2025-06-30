
const express = require('express');
// const fs = require('fs'); // <--- Ya no necesitamos 'fs'
const path = require('path');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js'); // <--- AÑADIMOS EL CLIENTE DE SUPABASE

const app = express();
const PORT = 3000;

// const RUTA_JSON = path.join(__dirname, '..', 'data', 'reportes.json'); // <--- Ya no necesitamos la ruta al JSON

// --- CONFIGURACIÓN DE SUPABASE ---
// ¡¡¡IMPORTANTE!!! Pega aquí las llaves de tu proyecto de Supabase
const supabaseUrl = 'https://aznedusbsakzvrfrjupa.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6bmVkdXNic2FrenZyZnJqdXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNjE2MTUsImV4cCI6MjA2NTgzNzYxNX0.8Y_eCnP4emXQGd7AXfoNrWjhczBS8-c29VdALJV4LHY';
const supabase = createClient(supabaseUrl, supabaseKey); // <-- Esto crea la conexión

app.use(cors());
app.use(express.json());

// Estas líneas para servir archivos estáticos están perfectas, no cambian
app.use(express.static(path.join(__dirname, '..', 'app')));
app.use('/styles', express.static(path.join(__dirname, '..', 'styles')));
app.use('/js', express.static(path.join(__dirname, '..', 'js')));
// app.use('/data', ...); // Esta línea ya no es necesaria si no sirves más archivos de 'data'

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'app', 'login.html'));
});

// --- RUTA PARA LEER TODOS LOS REPORTES (VERSIÓN SUPABASE) ---
app.get('/reportes', async (req, res) => {
    const { data, error } = await supabase
        .from('reportes')      // Nombre de tu tabla
        .select('*');          // Obtener todas las columnas

    if (error) {
        console.error('Error leyendo reportes:', error.message);
        return res.status(500).json({ mensaje: 'Error al leer los reportes' });
    }

    res.status(200).json(data);
});

// --- RUTA PARA CREAR UN NUEVO REPORTE (VERSIÓN SUPABASE) ---
app.post('/reportes', async (req, res) => {
    try {
        const nuevo = req.body;

        // El objeto que vamos a insertar.
        // Nota: Dejamos que Supabase genere el 'id' y la 'fecha' por nosotros.
        const reporteParaInsertar = {
            tipo: nuevo.tipo,
            descripcion: nuevo.descripcion,
            lat: nuevo.lat,
            lng: nuevo.lng,
            usuario: nuevo.usuario // Supabase puede guardar objetos JSON directamente
        };

        const { data, error } = await supabase
            .from('reportes')
            .insert([reporteParaInsertar])
            .select(); // .select() hace que nos devuelva el objeto creado

        if (error) {
            console.error('Error guardando reporte:', error.message);
            return res.status(500).json({ mensaje: 'Error al guardar el reporte', error: error.message });
        }

        res.status(201).json({ mensaje: 'Reporte guardado', reporte: data[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error inesperado al procesar el reporte' });
    }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});