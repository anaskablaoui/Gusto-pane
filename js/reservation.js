const reservTable = document.querySelector('#reservationTable');
const reservForm = document.getElementById('reserv-form');
const searchReservInput = document.getElementById('search-reservation');
const prevBtnReserv = document.getElementById('prev-page-reserv');
const nextBtnReserv = document.getElementById('next-page-reserv');
const pageInfoReserv = document.getElementById('page-info-reserv');
const itemsPerPageReservSelect = document.getElementById('items-per-page-reserv');

let reservations = [];
let reservationsFiltrees = []; // Liste filtrée par la recherche
let reservationSelected = null;
let nextReservId = 1;

// Variables de pagination
let currentPageReserv = 1;
let itemsPerPageReserv = 10;

// Charger les données
fetch('./data/reservation.json')
  .then(res => res.json())
  .then(data => {
    console.log('Données chargées:', data);  
    reservations = data.reservations || [];
    reservationsFiltrees = [...reservations];
    console.log('Reservations:', reservations);  
    
    // Calculer le prochain ID
    if (reservations.length > 0) {
      const maxId = Math.max(...reservations.map(r => r.id));
      nextReservId = maxId + 1;
    } else {
      nextReservId = 1;
    }
    
    afficherReservations();
  })
  .catch(err => console.log('Erreur JSON', err));

// Fonction d'affichage avec pagination
function afficherReservations() {
  reservTable.innerHTML = '';

  // Calculer les indices de début et fin
  const debut = (currentPageReserv - 1) * itemsPerPageReserv;
  const fin = debut + itemsPerPageReserv;
  const reservationsPage = reservationsFiltrees.slice(debut, fin);

  // Afficher les réservations de la page courante
  reservationsPage.forEach(reserv => {
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

  // Mettre à jour les infos de pagination
  updatePaginationInfoReserv();
}

// Mettre à jour les informations de pagination
function updatePaginationInfoReserv() {
  const totalPages = Math.ceil(reservationsFiltrees.length / itemsPerPageReserv);
  pageInfoReserv.textContent = `Page ${currentPageReserv} / ${totalPages}`;

  // Désactiver les boutons si nécessaire
  prevBtnReserv.disabled = currentPageReserv === 1;
  nextBtnReserv.disabled = currentPageReserv >= totalPages || totalPages === 0;
}

// Fonction de recherche
function rechercherReservations() {
  const searchTerm = searchReservInput.value.toLowerCase().trim();

  if (searchTerm === '') {
    reservationsFiltrees = [...reservations];
  } else {
    reservationsFiltrees = reservations.filter(reserv => 
      reserv.client.toLowerCase().includes(searchTerm)
    );
  }

  // Réinitialiser à la page 1 après recherche
  currentPageReserv = 1;
  afficherReservations();
}

// Événement de recherche
searchReservInput.addEventListener('input', rechercherReservations);

// Navigation pagination
prevBtnReserv.addEventListener('click', function() {
  if (currentPageReserv > 1) {
    currentPageReserv--;
    afficherReservations();
  }
});

nextBtnReserv.addEventListener('click', function() {
  const totalPages = Math.ceil(reservationsFiltrees.length / itemsPerPageReserv);
  if (currentPageReserv < totalPages) {
    currentPageReserv++;
    afficherReservations();
  }
});

// Changement du nombre d'items par page
itemsPerPageReservSelect.addEventListener('change', function() {
  itemsPerPageReserv = Number(this.value);
  currentPageReserv = 1; // Retour à la première page
  afficherReservations();
});

// Modifier / Supprimer
reservTable.addEventListener('click', function (e) {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  // Modifier
  if (e.target.classList.contains('modifier')) {
    reservationSelected = reservations.find(r => r.id === id);
    if (!reservationSelected) return;
    document.getElementById('reservationClient').value = reservationSelected.client;
    document.getElementById('reservationDate').value = reservationSelected.date;
  }

  // Supprimer
  if (e.target.classList.contains('supprimer')) {
    reservations = reservations.filter(r => r.id !== id);
    rechercherReservations(); // Re-filtrer et afficher
  }
});

// Ajout et mise à jour 
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

  rechercherReservations(); // Re-filtrer et afficher
  reservForm.reset();
});