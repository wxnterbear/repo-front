const express = require('express'); // Framework para Node.js para la creación de servidores
const fs = require('fs'); // Módulo fs para manipular archivos
const path = require('path'); // Módulo path para manejar rutas de archivos
const cors = require ('cors');
//const { default: Proposals } = require('../client/src/components/Proposals');

const app = express(); // Crea una instancia de una aplicación Express
const PORT = process.env.PORT || 3001; // Se define el puerto del servidor

app.use(express.json()); // Middleware (Sw entre el SO y la app) para parsear peticiones en formato JSON
app.use(cors());

// ------------------------------------------------ Eventos ------------------------------------------------ 
// Ruta para obtener todos los eventos
app.get('/events', (req, res) => {
    fs.readFile(path.join(__dirname, 'events.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.json(JSON.parse(data));
    });
});

// Ruta para crear un nuevo evento
app.post('/events', (req, res) => {
    fs.readFile(path.join(__dirname, 'events.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        const events = JSON.parse(data);
        const newEvent = req.body;
        events.push(newEvent);
        fs.writeFile(path.join(__dirname, 'events.json'), JSON.stringify(events), (err) => {
            if (err) {
                console.error('Error al escribir en el archivo:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            res.status(201).json(newEvent); // Envía el nuevo evento como respuesta
        });
    });
});

// Ruta para actualizar un evento existente
app.put('/events/:id', (req, res) => {
    fs.readFile(path.join(__dirname, 'events.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        const events = JSON.parse(data);
        const updatedEvent = req.body;
        const eventIndex = events.findIndex(event => event.id === req.params.id);
        if (eventIndex !== -1) {
            events[eventIndex] = updatedEvent;
            fs.writeFile(path.join(__dirname, 'events.json'), JSON.stringify(events), (err) => {
                if (err) {
                    console.error('Error al escribir en el archivo:', err);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
                res.json(updatedEvent);
            });
        } else {
            res.status(404).json({ message: 'Not Found' });
        }
    });
});

// Ruta para eliminar un evento
app.delete('/events/:id', (req, res) => {
    fs.readFile(path.join(__dirname, 'events.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        const events = JSON.parse(data);
        const filteredEvents = events.filter(event => event.id !== req.params.id);
        fs.writeFile(path.join(__dirname, 'events.json'), JSON.stringify(filteredEvents), (err) => {
            if (err) {
                console.error('Error al escribir en el archivo:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            res.status(204).end();
        });
    });
});

// ------------------------------------------------ Propuestas ------------------------------------------------ 

// Ruta para obtener todas las propuestas
app.get('/proposals', (req, res) => {
    fs.readFile(path.join(__dirname, 'proposals.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.json(JSON.parse(data));
    });
});

// Ruta para añadir propuesta

app.get('/proposals', (req,res) =>{
    fs.readFile(path.join(__dirname, 'proposals.json'), 'utf8', (err,data) =>{

        if(err){
            console.log('Error al leer archivo:', err);
            return res.status(500).json({message: 'Internal Server Error'});
        }
        const proposals = JSON.parse(data);
        const newProposal = req.body; // Obtiene la propuesta del cuerpo de la solicitud
        proposals.push(newProposal); // Agrega la nueva propuesta
        // Escribe la lista actualizada de las propuestas
        fs.writeFile(path.join(__dirname, 'proposals.json'), JSON.stringify(proposals), (err) => {
            if (err) {
                console.error('Error al escribir en el archivo:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
                res.status(201).json(newProposal); // Envía la nueva propuesta como respuesta
        });        
    });
});

// Ruta para agregar un comentario a una propuesta

app.post('/proposals/:id/comments', (req, res) => {
    fs.readFile(path.join(__dirname, 'proposals.json'), 'utf8', (err, data) => {
      if (err) {
        console.error('Error al leer el archivo:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      const proposals = JSON.parse(data);
      const proposal = proposals.find(p => p.id === req.params.id); // Encuentra la propuesta por el id
      
      if (!proposal) {
        return res.status(404).json({ message: 'Not Found' });
      }
  
      if (!proposal.comments) {
        proposal.comments = []; // Crear la lista si no existe
      }
  
      proposal.comments.push(req.body); // Agrega el comentario en la propuesta
  
      fs.writeFile(path.join(__dirname, 'proposals.json'), JSON.stringify(proposals), (err) => {
        if (err) {
          console.error('Error al escribir en el archivo:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(201).json(proposal);
      });
    });
  });  

// Ruta para aceptar una propuesta
app.put('/proposals/:id/accept', (req, res) => {
    fs.readFile(path.join(__dirname, 'proposals.json'), 'utf8', (err, data) => {
      if (err) {
        console.error('Error al leer el archivo:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
  
      const proposals = JSON.parse(data);
      const proposal = proposals.find(p => p.id === req.params.id);
      if (!proposal) {
        return res.status(404).json({ message: 'Not Found' });
      }
  
      proposal.status = 'accepted'; // Actualiza el estado de la propuesa a Aceptada
  
      fs.writeFile(path.join(__dirname, 'proposals.json'), JSON.stringify(proposals), (err) => {
        if (err) {
          console.error('Error al escribir en el archivo:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.json(proposal);
      });
    });
  });  

// Ruta para rechazar una propuesta

app.put('/proposals/:id/reject', (req, res) => {
    fs.readFile(path.join(__dirname, 'proposals.json'), 'utf8', (err, data) => {
      if (err) {
        console.error('Error al leer el archivo:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
  
      const proposals = JSON.parse(data);
      const proposal = proposals.find(p => p.id === req.params.id);
      if (!proposal) {
        return res.status(404).json({ message: 'Not Found' });
      }
  
      proposal.status = 'rejected'; // Actualiza el estado de la propuesta a Rechazada
  
      fs.writeFile(path.join(__dirname, 'proposals.json'), JSON.stringify(proposals), (err) => {
        if (err) {
          console.error('Error al escribir en el archivo:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.json(proposal);
      });
    });
  });
  

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});