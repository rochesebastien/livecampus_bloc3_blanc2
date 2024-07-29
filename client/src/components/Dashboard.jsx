import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
const baseURI = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
  const [clientCount, setClientCount] = useState(0);
  const [clientIds, setClientIds] = useState([]);
  const [voitures, setVoitures] = useState([]);
  const [newVoiture, setNewVoiture] = useState({ marque: '', modele: '', plaque: '', annee: '', client_id: '' });
  const [editingVoiture, setEditingVoiture] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientCount = async () => {
      try {
        const response = await fetch(baseURI + 'api/clients/count', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setClientCount(data.count);
        } else {
          alert('Erreur lors de la récupération du nombre de clients');
          navigate('/');
        }
      } catch (error) {
        alert('Erreur réseau');
        navigate('/');
      }
    };


    // request to get all client ids with the route /api/clients/ids
      const fetchClientIds = async () => {
          try {
              const response = await fetch(baseURI + 'api/clients/ids', {
                  method: 'GET',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include'
              });
            console.log(response)
              if (response.ok) {
                  const data = await response.json();
                  setClientIds(data);
              } else {
                  alert('Erreur lors de la récupération des données clients');
                  navigate('/');
              }
          } catch (error) {
              alert('Erreur réseau');
              navigate('/');
          }
      };


    const fetchVoitures = async () => {
      try {
        const response = await fetch(baseURI + 'api/voitures', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setVoitures(data);
        } else {
          alert('Erreur lors de la récupération des véhicules');
        }
      } catch (error) {
        alert('Erreur réseau');
      }
    };

    fetchClientCount();
    fetchClientIds();
    fetchVoitures();
  }, [navigate]);

  const handleAddVoiture = async () => {
    try {
      const response = await fetch(baseURI + 'api/voitures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newVoiture)
      });
      if (response.ok) {
        const resp = await response.json();
        console.log(resp.voiture)
        setVoitures([...voitures, resp.voiture]);
        setNewVoiture({ marque: '', modele: '', annee: '', client_id: '' });
      } else {
        alert('Erreur lors de l\'ajout du véhicule');
      }
    } catch (error) {
      console.log(error)
      alert('Erreur réseau');
    }
  };

  const handleUpdateVoiture = async (id) => {
    try {
      const response = await fetch(baseURI + `api/voitures/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editingVoiture)
      });
      if (response.ok) {
        const updatedVoiture = await response.json();
        setVoitures(voitures.map(v => v.id === id ? updatedVoiture : v));
        setEditingVoiture(null);
      } else {
        alert('Erreur lors de la modification du véhicule');
      }
    } catch (error) {
      alert('Erreur réseau');
    }
  };

  const handleDeleteVoiture = async (id) => {
    try {
      const response = await fetch(baseURI + `api/voitures/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (response.ok) {
        setVoitures(voitures.filter(v => v.id !== id));
      } else {
        alert('Erreur lors de la suppression du véhicule');
      }
    } catch (error) {
      alert('Erreur réseau');
    }
  };

  return (
      <div className="admin-dashboard">
        <h2>Tableau de bord admin</h2>
        <p>Nombre de clients inscrits : {clientCount}</p>

        <h3>Liste des véhicules</h3>
        <ul>
          {voitures.map(voiture => (
              <li key={voiture.id}>
                {voiture.marque} {voiture.modele} ({voiture.plaque}, {voiture.annee}) - Client ID: {voiture.client_id}
                <button onClick={() => setEditingVoiture(voiture)}>Modifier</button>
                <button onClick={() => handleDeleteVoiture(voiture.id)}>Supprimer</button>
              </li>
          ))}
        </ul>

          {!editingVoiture && (
              <>
                <h3>Ajouter un nouveau véhicule</h3>
                <input
                    type="text"
                    placeholder="Marque"
                    value={newVoiture.marque}
                    onChange={(e) => setNewVoiture({...newVoiture, marque: e.target.value})}
                />
                <input
                    type="text"
                    placeholder="Modèle"
                    value={newVoiture.modele}
                    onChange={(e) => setNewVoiture({...newVoiture, modele: e.target.value})}
                />
                <input
                    type="text"
                    placeholder="Plaque"
                    value={newVoiture.plaque}
                    onChange={(e) => setNewVoiture({...newVoiture, plaque: e.target.value})}
                />
                <input
                    type="number"
                    placeholder="Année"
                    value={newVoiture.annee}
                    onChange={(e) => setNewVoiture({...newVoiture, annee: e.target.value})}
                />
                <select
                    value={newVoiture.client_id}
                    onChange={(e) => setNewVoiture({...newVoiture, client_id: e.target.value})}
                >
                  <option value="">Sélectionner un client</option>
                  {clientIds.map(id => (
                      <option key={id} value={id}>{id}</option>
                  ))}
                </select>
                <button onClick={handleAddVoiture}>Ajouter</button>
              </>
          )}


        {editingVoiture && (
            <div>
              <h3>Modifier le véhicule</h3>
              <input
                  type="text"
                  placeholder="Marque"
                  value={editingVoiture.marque}
                  onChange={(e) => setEditingVoiture({...editingVoiture, marque: e.target.value})}
              />
              <input
                  type="text"
                  placeholder="Modèle"
                  value={editingVoiture.modele}
                  onChange={(e) => setEditingVoiture({...editingVoiture, modele: e.target.value})}
              />
              <input
                  type="text"
                  placeholder="Plaque"
                  value={editingVoiture.plaque}
                  onChange={(e) => setEditingVoiture({...editingVoiture, plaque: e.target.value})}
              />
              <input
                  type="number"
                  placeholder="Année"
                  value={editingVoiture.annee}
                  onChange={(e) => setEditingVoiture({...editingVoiture, annee: e.target.value})}
              />
              <select
                  value={editingVoiture.client_id}
                  onChange={(e) => setEditingVoiture({...editingVoiture, client_id: e.target.value})}
              >
                <option value="">Sélectionner un client</option>
                {clientIds.map(id => (
                    <option key={id} value={id}>{id}</option>
                ))}
              </select>
              <button onClick={() => handleUpdateVoiture(editingVoiture.id)}>Mettre à jour</button>
              <button onClick={() => setEditingVoiture(null)}>Annuler</button>
            </div>
        )}
      </div>
  );
};

export default AdminDashboard;
