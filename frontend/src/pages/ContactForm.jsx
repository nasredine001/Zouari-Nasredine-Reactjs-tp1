import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiCamera, FiX, FiCheck } from 'react-icons/fi';
import API from '../api';

export default function ContactForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [active, setActive] = useState(true);
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      API.get(`/contacts/${id}`).then((res) => {
        const c = res.data;
        setNom(c.nom);
        setPrenom(c.prenom);
        setActive(c.active);
        if (c.photo) setPreview(`http://localhost:5000${c.photo}`);
      }).catch(() => toast.error("Contact introuvable"));
    }
  }, [id, isEdit]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoFile(null);
    setPreview(null);
  };

  const validate = () => {
    const errs = {};
    if (!prenom.trim()) errs.prenom = 'Le prénom est requis';
    if (!nom.trim()) errs.nom = 'Le nom est requis';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    const formData = new FormData();
    formData.append('nom', nom.trim());
    formData.append('prenom', prenom.trim());
    formData.append('active', active);
    if (photoFile) formData.append('photo', photoFile);

    try {
      if (isEdit) {
        await API.put(`/contacts/${id}`, formData);
        toast.success('Contact modifié avec succès');
      } else {
        await API.post('/contacts', formData);
        toast.success('Contact créé avec succès');
      }
      navigate('/');
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h1>{isEdit ? 'Modifier le contact' : 'Nouveau contact'}</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="photo-upload">
            <label htmlFor="photo-input" className="photo-preview-wrapper">
              {preview ? (
                <>
                  <img src={preview} alt="preview" />
                  <button type="button" className="photo-remove" onClick={removePhoto} aria-label="Retirer la photo">
                    <FiX />
                  </button>
                </>
              ) : (
                <span className="photo-placeholder">
                  <FiCamera size={22} />
                  Ajouter une photo
                </span>
              )}
            </label>
            <input id="photo-input" type="file" accept="image/*" onChange={handlePhotoChange} hidden />
          </div>

          <div className="form-group">
            <label>Prénom</label>
            <input
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className={errors.prenom ? 'input-error' : ''}
            />
            {errors.prenom && <span className="field-error">{errors.prenom}</span>}
          </div>

          <div className="form-group">
            <label>Nom</label>
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className={errors.nom ? 'input-error' : ''}
            />
            {errors.nom && <span className="field-error">{errors.nom}</span>}
          </div>

          <div className="form-group">
            <label>Situation</label>
            <div className="radio-toggle">
              <label className={`radio-option active-option ${active ? 'selected' : ''}`}>
                <input type="radio" name="situation" checked={active} onChange={() => setActive(true)} />
                Actif
              </label>
              <label className={`radio-option inactive-option ${!active ? 'selected' : ''}`}>
                <input type="radio" name="situation" checked={!active} onChange={() => setActive(false)} />
                Inactif
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <FiCheck /> {saving ? 'Enregistrement...' : isEdit ? 'Enregistrer' : 'Créer'}
            </button>
            <button type="button" className="btn btn-cancel" onClick={() => navigate('/')}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
