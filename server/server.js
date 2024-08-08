const express = require('express'); // Framework para Node.js para la creación de servidores
const fs = require('fs').promises; // fs.promises para manipular archivos de manera asíncrona
const path = require('path'); // Módulo path para manejar rutas de archivos
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer'); //Middleware para manejar los archivos en multipart/form-data

const app = express(); // Crea una instancia de una aplicación Express
const PORT = process.env.PORT || 3001; // Se define el puerto del servidor

app.use(express.json()); // Middleware (Sw entre el SO y la app) para parsear peticiones en formato JSON
app.use(cors());
app.use(bodyParser.json());

// Configuración de multer -> herramienta para subir archivos de un form al servidor
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    //file-fieldname -> nombre
    //ext -> extensión
  }
});

const upload = multer ({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];
    if(!allowedTypes.includes(file.mimetype)){
      return cb(new Error('Tipo de archivo no permitido'), false);
    }
    cb(null, true);
  },
  limits: {fileSize: 2 * 1024 * 1024} // 2MB máx
})

// se crea directorio de uploads si no existe
fs.mkdir('uploads').catch(() => {});

// ------------------------------------------------ Eventos ------------------------------------------------ 
// Ruta para obtener todos los eventos
app.get('/events', async (req, res) => {

  try {

    const data = await fs.readFile(path.join(__dirname, 'events.json'), 'utf8');
    res.json(JSON.parse(data));

  } catch (err) {

    console.error('Error al leer el archivo:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Ruta para crear un nuevo evento
app.post('/events', async (req, res) => {
  try {

    const data = await fs.readFile(path.join(__dirname, 'events.json'), 'utf8');
    const events = JSON.parse(data);
    const newEvent = req.body;
    events.push(newEvent);
    await fs.writeFile(path.join(__dirname, 'events.json'), JSON.stringify(events));
    res.status(201).json(newEvent);

  } catch (err) {

    console.error('Error al leer o escribir en el archivo:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Ruta para actualizar un evento existente
app.put('/events/:id', async (req, res) => {

  try {
    const data = await fs.readFile(path.join(__dirname, 'events.json'), 'utf8');
    const events = JSON.parse(data);
    const updatedEvent = req.body;
    const eventIndex = events.findIndex(event => event.id === req.params.id);
    
    if (eventIndex !== -1) {
      events[eventIndex] = updatedEvent;
      await fs.writeFile(path.join(__dirname, 'events.json'), JSON.stringify(events));
      res.json(updatedEvent);

    } else {

      res.status(404).json({ message: 'Not Found' });
    }

  } catch (err) {

    console.error('Error al leer o escribir en el archivo:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Ruta para eliminar un evento
app.delete('/events/:id', async (req, res) => {
  try {

    const data = await fs.readFile(path.join(__dirname, 'events.json'), 'utf8');
    const events = JSON.parse(data);
    const filteredEvents = events.filter(event => event.id !== req.params.id);
    await fs.writeFile(path.join(__dirname, 'events.json'), JSON.stringify(filteredEvents));
    res.status(204).end();

  } catch (err) {

    console.error('Error al leer o escribir en el archivo:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ------------------------------------------------ Propuestas ------------------------------------------------ 

// Ruta para obtener todas las propuestas
app.get('/proposals', async (req, res) => {

  try {
    const data = await fs.readFile(path.join(__dirname, 'proposals.json'), 'utf8');
    res.json(JSON.parse(data));

  } catch (err) {
    console.error('Error al leer el archivo:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Ruta para añadir propuesta

app.post('/proposals', upload.single('file'), async (req, res) => {
  
  try {
    const data = await fs.readFile(path.join(__dirname, 'proposals.json'), 'utf8');
    const proposals = JSON.parse(data);
    const newProposal = req.body;
    
    if (req.file) {
      newProposal.file = req.file.path; // Guarda la ruta del archivo subido
    }
    proposals.push(newProposal);
    await fs.writeFile(path.join(__dirname, 'proposals.json'), JSON.stringify(proposals));
    res.status(201).json(newProposal);
  
  } catch (err) {
    console.error('Error al leer o escribir en el archivo:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Ruta para agregar un comentario a una propuesta

app.post('/proposals/:id/comments', async (req, res) => {
  
  try {
    const data = await fs.readFile(path.join(__dirname, 'proposals.json'), 'utf8');
    const proposals = JSON.parse(data);
    const proposal = proposals.find(p => p.id === req.params.id);
    
    if (!proposal) {
      return res.status(404).json({ message: 'Not Found' });
    }
    
    if (!proposal.comments) {
      proposal.comments = []; // Crear la lista si no existe
    }
    proposal.comments.push(req.body); // agrega el comentario en la propuesta
    await fs.writeFile(path.join(__dirname, 'proposals.json'), JSON.stringify(proposals));
    res.status(201).json(proposal);
  
  } catch (err) {
    console.error('Error al leer o escribir en el archivo:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Ruta para aceptar una propuesta
app.put('/proposals/:id/accept', async (req, res) => {
  
  try {
    const data = await fs.readFile(path.join(__dirname, 'proposals.json'), 'utf8');
    const proposals = JSON.parse(data);
    const proposal = proposals.find(p => p.id === req.params.id);
    
    if (!proposal) {
      return res.status(404).json({ message: 'Not Found' });
    }
    proposal.status = 'accepted'; // Actualiza el estado de la propuesta a Aceptada
    await fs.writeFile(path.join(__dirname, 'proposals.json'), JSON.stringify(proposals));
    res.json(proposal);
  
  } catch (err) {
    console.error('Error al leer o escribir en el archivo:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Ruta para rechazar una propuesta

app.put('/proposals/:id/reject', async (req, res) => {
  
  try {
    const data = await fs.readFile(path.join(__dirname, 'proposals.json'), 'utf8');
    const proposals = JSON.parse(data);
    const proposal = proposals.find(p => p.id === req.params.id);
    
    if (!proposal) {
      return res.status(404).json({ message: 'Not Found' });
    }
    proposal.status = 'rejected'; // Actualiza el estado de la propuesta a Rechazada
    await fs.writeFile(path.join(__dirname, 'proposals.json'), JSON.stringify(proposals));
    res.json(proposal);
  
  } catch (err) {
    console.error('Error al leer o escribir en el archivo:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/* --------------------------------------- */

const ideasFilePath = './ideas.json';
const acceptedIdeasFilePath = './accepted_ideas.json';
const rejectedIdeasFilePath = './rejected_ideas.json';

// funciones auxiliares
const readJSONFile = (filePath) => {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}; // lee el archivo y lo cnvierte en un objeto

const writeJSONFile = async (filePath, data) => {
    await fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}; // toma un objeto y lo guarda como un archivo JSON

// obtener ideas

app.get('/ideas', async (req, res) => {
  
  try {
      const ideas = await readJSONFile(ideasFilePath);
      res.json(ideas);
  
    } catch (err) {
      console.error('Error al leer el archivo de ideas:', err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

// guardar ideas
app.post('/ideas', async (req, res) => {
  
  try {
      const newIdea = req.body.idea;
      const ideas = await readJSONFile(ideasFilePath);
      ideas.push(newIdea);
      await writeJSONFile(ideasFilePath, ideas);
      res.status(201).json({ message: 'Idea added successfully' });
  
    } catch (err) {
      console.error('Error al guardar la idea:', err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

// guardar ideas aceptadas
app.post('/ideas/accept', async (req, res) => {
  
  try {
      const { idea, user } = req.body;
      const acceptedIdeas = await readJSONFile(acceptedIdeasFilePath);
      acceptedIdeas.push({ idea, user });
      await writeJSONFile(acceptedIdeasFilePath, acceptedIdeas);
      res.status(201).json({ message: 'Idea accepted successfully' });
  
    } catch (err) {
      console.error('Error al aceptar la idea:', err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

// guardar ideas rechazadas
app.post('/ideas/reject', async (req, res) => {
  
  try {
      const { idea, user } = req.body;
      const rejectedIdeas = await readJSONFile(rejectedIdeasFilePath);
      rejectedIdeas.push({ idea, user });
      await writeJSONFile(rejectedIdeasFilePath, rejectedIdeas);
      res.status(201).json({ message: 'Idea rejected successfully' });
  
    } catch (err) {
      console.error('Error al rechazar la idea:', err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

// obtener ideas aceptadas
app.get('/ideas/:status', async (req, res) => {
  const { status } = req.params;
  
  try {
      const filePath = status === 'accepted' ? acceptedIdeasFilePath : rejectedIdeasFilePath;
      const ideas = await readJSONFile(filePath);
      res.json(ideas);
  
    } catch (err) {
      console.error('Error al leer el archivo de ideas:', err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});