const tableBody = document.querySelector('.table-restaut table tbody');
if (!tableBody) return;
const formRestaurant = document.getElementById('form-restaut');
const searchRestaurantInput = document.getElementById('search-restaurant');
const prevBtnRestaurant = document.getElementById('prev-page-restaurant');
const nextBtnRestaurant = document.getElementById('next-page-restaurant');
const pageInfoRestaurant = document.getElementById('page-info-restaurant');
const itemsPerPageRestaurantSelect = document.getElementById('items-per-page-restaurant');

const inputNom = document.getElementById('Rnom');
const inputAdresse = document.getElementById('Radress');
const inputTable = document.getElementById('Rtable');

let restaurants = [];
let restaurantsFiltre = []; // Liste filtrée par la recherche
let restaurantSelected = null;
let nextId = 1;

// Variables de pagination
let currentPageRestaurant = 1;
let itemsPerPageRestaurant = 10;

// Charger les données
fetch('./data/restaurant.json')
  .then(res => res.json())
  .then(data => {
    restaurants = data.restaurants || [];
    restaurantsFiltre = [...restaurants];

    // Calcul du prochain ID
    const maxId = restaurants.length
      ? Math.max(...restaurants.map(r => r.id))
      : 0;
    nextId = maxId + 1;

    afficherRestaurants();
  })
  .catch(err => console.log('Erreur JSON :', err));

// Fonction d'affichage avec pagination
function afficherRestaurants() {
  tableBody.innerHTML = '';

  // Calculer les indices de début et fin
  const debut = (currentPageRestaurant - 1) * itemsPerPageRestaurant;
  const fin = debut + itemsPerPageRestaurant;
  const restaurantsPage = restaurantsFiltre.slice(debut, fin);

  // Afficher les restaurants de la page courante
  restaurantsPage.forEach(rest => {
    const tr = document.createElement('tr');
    tr.dataset.id = rest.id;

    tr.innerHTML = `
      <td>${rest.nom}</td>
      <td>${rest.adresse}</td>
      <td>${rest.tables}</td>
      <td>
        <button class="modifier" data-id="${rest.id}">Modifier</button>
        <button class="supprimer" data-id="${rest.id}">Supprimer</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });

  // Mettre à jour les infos de pagination
  updatePaginationInfoRestaurant();
}

// Mettre à jour les informations de pagination
function updatePaginationInfoRestaurant() {
  const totalPages = Math.ceil(restaurantsFiltre.length / itemsPerPageRestaurant);
  pageInfoRestaurant.textContent = `Page ${currentPageRestaurant} / ${totalPages}`;

  // Désactiver les boutons si nécessaire
  prevBtnRestaurant.disabled = currentPageRestaurant === 1;
  nextBtnRestaurant.disabled = currentPageRestaurant >= totalPages || totalPages === 0;
}

// Fonction de recherche
function rechercherRestaurants() {
  const searchTerm = searchRestaurantInput.value.toLowerCase().trim();

  if (searchTerm === '') {
    restaurantsFiltre = [...restaurants];
  } else {
    restaurantsFiltre = restaurants.filter(rest => 
      rest.nom.toLowerCase().includes(searchTerm) ||
      rest.adresse.toLowerCase().includes(searchTerm)
    );
  }

  // Réinitialiser à la page 1 après recherche
  currentPageRestaurant = 1;
  afficherRestaurants();
}

// Événement de recherche
searchRestaurantInput.addEventListener('input', rechercherRestaurants);

// Navigation pagination
prevBtnRestaurant.addEventListener('click', function() {
  if (currentPageRestaurant > 1) {
    currentPageRestaurant--;
    afficherRestaurants();
  }
});

nextBtnRestaurant.addEventListener('click', function() {
  const totalPages = Math.ceil(restaurantsFiltre.length / itemsPerPageRestaurant);
  if (currentPageRestaurant < totalPages) {
    currentPageRestaurant++;
    afficherRestaurants();
  }
});

// Changement du nombre d'items par page
itemsPerPageRestaurantSelect.addEventListener('change', function() {
  itemsPerPageRestaurant = Number(this.value);
  currentPageRestaurant = 1; // Retour à la première page
  afficherRestaurants();
});

// Modifier / Supprimer
tableBody.addEventListener('click', function (e) {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  // Modifier
  if (e.target.classList.contains('modifier')) {
    restaurantSelected = restaurants.find(r => r.id === id);
    if (!restaurantSelected) return;

    inputNom.value = restaurantSelected.nom;
    inputAdresse.value = restaurantSelected.adresse;
    inputTable.value = restaurantSelected.tables;
  }

  // Supprimer
  if (e.target.classList.contains('supprimer')) {
    restaurants = restaurants.filter(r => r.id !== id);
    
    // Reset formulaire si on supprime l'élément sélectionné
    if (restaurantSelected && restaurantSelected.id === id) {
      restaurantSelected = null;
      formRestaurant.reset();
    }
    
    rechercherRestaurants(); // Re-filtrer et afficher
  }
});

// Ajout / Modification
formRestaurant.addEventListener('submit', function (e) {
  e.preventDefault();

  if (restaurantSelected === null) {
    // AJOUT 
    const nouveauRestaurant = {
      id: nextId++,
      nom: inputNom.value,
      adresse: inputAdresse.value,
      tables: Number(inputTable.value)
    };
    restaurants.push(nouveauRestaurant);
  } else {
    // MODIFICATION
    restaurantSelected.nom = inputNom.value;
    restaurantSelected.adresse = inputAdresse.value;
    restaurantSelected.tables = Number(inputTable.value);

    restaurantSelected = null;
  }

  rechercherRestaurants(); // Re-filtrer et afficher
  formRestaurant.reset();
});