import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiUserPlus, FiSearch } from 'react-icons/fi';
import API from '../api';
import ConfirmModal from '../components/ConfirmModal';

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | inactive
  const [toDelete, setToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/contacts');
      setContacts(res.data);
    } catch (err) {
      toast.error("Impossible de charger les contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchSearch = `${c.prenom} ${c.nom}`.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || (filter === 'active' ? c.active : !c.active);
      return matchSearch && matchFilter;
    });
  }, [contacts, search, filter]);

  const confirmDelete = async () => {
    try {
      await API.delete(`/contacts/${toDelete.id}`);
      toast.success(`${toDelete.prenom} ${toDelete.nom} a été supprimé`);
      setToDelete(null);
      fetchContacts();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Liste des contacts</h1>
        <button className="btn btn-primary" onClick={() => navigate('/ajouter')}>
          <FiUserPlus /> Ajouter un contact
        </button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Tous</button>
          <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Actifs</button>
          <button className={filter === 'inactive' ? 'active' : ''} onClick={() => setFilter('inactive')}>Inactifs</button>
        </div>
      </div>

      {loading ? (
        <div className="skeleton-grid">
          {[...Array(4)].map((_, i) => <div className="skeleton-card" key={i} />)}
        </div>
      ) : filteredContacts.length === 0 ? (
        <p className="empty-state">
          {contacts.length === 0 ? 'Aucun contact pour le moment.' : 'Aucun résultat pour cette recherche.'}
        </p>
      ) : (
        <div className="contact-grid">
          {filteredContacts.map((c) => (
            <div className="contact-card" key={c.id}>
              <img
                className="contact-photo"
                src={c.photo ? `http://localhost:5000${c.photo}` : 'https://via.placeholder.com/90?text=Photo'}
                alt={`${c.prenom} ${c.nom}`}
              />
              <h3>{c.prenom} {c.nom}</h3>
              <span className={`badge ${c.active ? 'badge-active' : 'badge-inactive'}`}>
                {c.active ? 'Actif' : 'Inactif'}
              </span>
              <div className="card-actions">
                <button className="btn btn-edit" onClick={() => navigate(`/modifier/${c.id}`)}>
                  <FiEdit2 /> Modifier
                </button>
                <button className="btn btn-delete" onClick={() => setToDelete(c)}>
                  <FiTrash2 /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(toDelete)}
        title="Supprimer ce contact ?"
        message={toDelete ? `Cette action est irréversible pour ${toDelete.prenom} ${toDelete.nom}.` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
