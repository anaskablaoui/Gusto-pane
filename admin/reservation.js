const reservTable = document.querySelector('#reservationTable');
const reservForm = document.getElementById('reserv-form');
let reservations = [];
let reservationSelected = null;
let nextReservId = 1;



/* ===== Charger données ===== */
fetch('../data/reservation.json')
  .then(res => res.json())
  .then(data => {
    console.log('Données chargées:', data);  
    reservations = data.reservations || [];
    console.log('Reservations:', reservations);  
    
    // Calculer le prochain ID
    if (reservations.length > 0) {
      const maxId = Math.max(...reservations.map(r => r.id));
      nextReservId = maxId + 1;
    } else {
      nextReservId = 1;
    }
    
    afficherReservations(reservations);
  })
  .catch(err => console.log('Erreur JSON', err));

/* ===== Affichage ===== */
function afficherReservations(liste) {
  reservTable.innerHTML = '';
  liste.forEach(reserv => {
    const tr = document.createElement('tr');
    tr.dataset.id = reserv.id;
    tr.innerHTML = `
      <td>${reserv.client}</td>
      <td>${reserv.date}</td>
      <td>
        <button class="modifier" data-id="${reserv.id}">Modifier</button>
        <button class="supprimer" data-id="${reserv.id}">Supprimer</button>
      </td>
    `;
    reservTable.appendChild(tr);
  });
}

/* ===== Délégation événements (modifier / supprimer) ===== */
reservTable.addEventListener('click', function (e) {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  /* MODIFIER */
  if (e.target.classList.contains('modifier')) {
    reservationSelected = reservations.find(r => r.id === id);
    if (!reservationSelected) return;
    document.getElementById('reservationClient').value = reservationSelected.client;
    document.getElementById('reservationDate').value = reservationSelected.date;
  }

  /* SUPPRIMER */
  if (e.target.classList.contains('supprimer')) {
    reservations = reservations.filter(r => r.id !== id);
    afficherReservations(reservations);
  }
});

/* ===== Ajouter / Mettre à jour ===== */
reservForm.addEventListener('submit', function (e) {
  e.preventDefault();

  if (reservationSelected === null) {
    // AJOUT
    const nouvelleReservation = {
      id: nextReservId++,
      client: document.getElementById('reservationClient').value,
      date: document.getElementById('reservationDate').value
    };
    reservations.push(nouvelleReservation);
  } else {
    // MODIFICATION
    reservationSelected.client = document.getElementById('reservationClient').value;
    reservationSelected.date = document.getElementById('reservationDate').value;
    reservationSelected = null;
  }

  afficherReservations(reservations);
  reservForm.reset();
});