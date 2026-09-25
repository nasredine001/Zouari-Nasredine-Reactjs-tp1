const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

const DATA_FILE = path.join(__dirname, 'data', 'contacts.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Initialisation des dossiers/fichiers si absents
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(path.dirname(DATA_FILE))) fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// Configuration de multer pour l'upload des photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

function readContacts() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}
function writeContacts(contacts) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(contacts, null, 2));
}

// GET /api/contacts - liste tous les contacts
app.get('/api/contacts', (req, res) => {
  res.json(readContacts());
});

// GET /api/contacts/:id - un contact
app.get('/api/contacts/:id', (req, res) => {
  const contact = readContacts().find(c => c.id === req.params.id);
  if (!contact) return res.status(404).json({ message: 'Contact non trouvé' });
  res.json(contact);
});

// POST /api/contacts - créer un contact
app.post('/api/contacts', upload.single('photo'), (req, res) => {
  const contacts = readContacts();
  const newContact = {
    id: Date.now().toString(),
    nom: req.body.nom,
    prenom: req.body.prenom,
    active: req.body.active === 'true',
    photo: req.file ? `/uploads/${req.file.filename}` : null
  };
  contacts.push(newContact);
  writeContacts(contacts);
  res.status(201).json(newContact);
});

// PUT /api/contacts/:id - modifier un contact
app.put('/api/contacts/:id', upload.single('photo'), (req, res) => {
  const contacts = readContacts();
  const index = contacts.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Contact non trouvé' });

  const existing = contacts[index];
  const updated = {
    ...existing,
    nom: req.body.nom ?? existing.nom,
    prenom: req.body.prenom ?? existing.prenom,
    active: req.body.active !== undefined ? req.body.active === 'true' : existing.active,
    photo: req.file ? `/uploads/${req.file.filename}` : existing.photo
  };
  contacts[index] = updated;
  writeContacts(contacts);
  res.json(updated);
});

// DELETE /api/contacts/:id - supprimer un contact
app.delete('/api/contacts/:id', (req, res) => {
  let contacts = readContacts();
  const contact = contacts.find(c => c.id === req.params.id);
  contacts = contacts.filter(c => c.id !== req.params.id);
  writeContacts(contacts);
  if (contact && contact.photo) {
    const filePath = path.join(__dirname, contact.photo);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  res.json({ message: 'Contact supprimé' });
});

app.listen(PORT, () => console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`));
