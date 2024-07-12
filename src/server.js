const express = require('express'); // Framework para Node.js para la creación de servidores
const fs = require('fs'); // Módulo fs para manipular archivos
const path = require('path'); // Módulo path para manejar rutas de archivos

const app = express(); // Crea una instancia de una aplicación Express
const PORT = process.env.PORT || 3000; // Se define el puerto del servidor

app.use(express.json()); // Middleware (Sw entre el SO y la app) para parsear peticiones en formato JSON


// Ruta para obtener todos los eventos
app.get('/events', (req, res) => {
    fs.readFile(path.join(__dirname, 'src', 'events.json'), 'utf8', (err, data) => { // Lee el archivo events.json
        // Manejo de errores
        if (err) { 
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ message: 'Internal Server Error' }); // No puede leer el archivo
        }
        res.json(JSON.parse(data)); // Responde con los eventos en formato JSON
    });
});

// Ruta Post -> Crear evento
app.post('/events', (req, res) => {
    fs.readFile(path.join(__dirname, 'src', 'events.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ message: 'Internal Server Error' }); 
        }
        const events = JSON.parse(data); // Parsea los datos del archivo como JSON
        const newEvent = req.body; // Toma el nuevo evento del cuerpo de la solicitud
        events.push(newEvent); // Añade el nuevo evento a la lista de eventos
        fs.writeFile('events.json', JSON.stringify(events), (err) => { // stringify (convierte events en una cadena JSON)
            if (err) { 
                console.error('Error al escribir en el archivo:', err);
                return res.status(500).json({ message: 'Internal Server Error' }); 
            }
            res.status(201).json(newEvent); // Evento creado -> Ok
        });
    });
});

// Ruta Put -> Actualizar evento
app.put('/events/:id', (req, res) => {
    fs.readFile(path.join(__dirname, 'src', 'events.json'), 'utf8', (err, data) => {
        if (err) { 
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ message: 'Internal Server Error' }); 
        }
        const events = JSON.parse(data); 
        const updatedEvent = req.body; // Toma el evento actualizado del cuerpo de la solicitud
        const eventIndex = events.findIndex(event => event.id === req.params.id); // Encuentra el id del evento a actualizar
        //Si existe el evento
        if (eventIndex !== -1) { 
            events[eventIndex] = updatedEvent; // Actualiza el evento en la lista de eventos
            fs.writeFile(path.join(__dirname, 'src', 'events.json'), JSON.stringify(events), (err) => {
                if (err) { 
                    console.error('Error al escribir en el archivo:', err);
                    return res.status(500).json({ message: 'Internal Server Error' }); 
                }
                res.json(updatedEvent); // Evento actualizado
            });
        } else {
            res.status(404).json({ message: 'Not Found' }); 
        }
    });
});

// Ruta Delete -> Eliminar evento
app.delete('/events/:id', (req, res) => {
    fs.readFile('events.json', 'utf8', (err, data) => { 
        if (err) { 
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ message: 'Internal Server Error' }); 
        }
        const events = JSON.parse(data); 
        const filteredEvents = events.filter(event => event.id !== req.params.id); // Filtra los eventos de la lisra para encontrar el evento específico
        fs.writeFile('events.json', JSON.stringify(filteredEvents), (err) => { 
            if (err) { 
                console.error('Error al escribir en el archivo:', err);
                return res.status(500).json({ message: 'Internal Server Error' }); 
            }
            res.status(204).end(); // Evento eliminado
        });
    });
});

// Middleware para entregar los archivos en la carpeta Build sin procesarlos dinámicamente
app.use(express.static(path.join(__dirname, 'build')));

// Maneja cualquier otra ruta que no coincida con las rutas definidas y sirve el archivo index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html')); // Sirve el archivo index.html para cualquier ruta no definida
});

// Inicia el servidor en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`); // Muestra un mensaje indicando que el servidor está corriendo
});
