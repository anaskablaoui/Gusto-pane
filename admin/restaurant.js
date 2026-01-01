// ===================== SELECTEURS =====================
const tableBody = document.querySelector('.table-restaut table tbody');
const formRestaurant = document.getElementById('form-restaut');

const inputNom = document.getElementById('Rnom');
const inputAdresse = document.getElementById('Radress');
const inputTable = document.querySelector('#form-restaut input[type="number"]');

// ===================== DONNÉES =====================
let restaurants = [];
let restaurantSelected = null;
let nextId = 1;

// ===================== FETCH JSON =====================
fetch('../data/restaurant.json')
  .then(res => res.json())
  .then(data => {
    restaurants = data.restaurants || [];

    // calcul du prochain ID
    const maxId = restaurants.length
      ? Math.max(...restaurants.map(r => r.id))
      : 0;
    nextId = maxId + 1;

    afficherRestaurants(restaurants);
  })
  .catch(err => console.log('Erreur JSON :', err));

// ===================== AFFICHAGE =====================
function afficherRestaurants(liste) {
  tableBody.innerHTML = '';

  liste.forEach(rest => {
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
}

// ===================== CLICK TABLE (MODIFIER / SUPPRIMER) =====================
tableBody.addEventListener('click', function (e) {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  // ---------- MODIFIER ----------
  if (e.target.classList.contains('modifier')) {
    restaurantSelected = restaurants.find(r => r.id === id);
    if (!restaurantSelected) return;

    inputNom.value = restaurantSelected.nom;
    inputAdresse.value = restaurantSelected.adresse;
    inputTable.value = restaurantSelected.tables;
  }

  // ---------- SUPPRIMER ----------
  if (e.target.classList.contains('supprimer')) {
    restaurants = restaurants.filter(r => r.id !== id);
    afficherRestaurants(restaurants);

    // reset formulaire si on supprime l'élément sélectionné
    if (restaurantSelected && restaurantSelected.id === id) {
      restaurantSelected = null;
      formRestaurant.reset();
    }
  }
});

// ===================== SUBMIT FORM (AJOUT / MODIFICATION) =====================
formRestaurant.addEventListener('submit', function (e) {
  e.preventDefault();

  if (restaurantSelected === null) {
    // ---------- AJOUT ----------
    const nouveauRestaurant = {
      id: nextId++,
      nom: inputNom.value,
      adresse: inputAdresse.value,
      tables: Number(inputTable.value)
    };
    restaurants.push(nouveauRestaurant);
  } else {
    // ---------- MODIFICATION ----------
    restaurantSelected.nom = inputNom.value;
    restaurantSelected.adresse = inputAdresse.value;
    restaurantSelected.tables = Number(inputTable.value);

    restaurantSelected = null;
  }

  afficherRestaurants(restaurants);
  formRestaurant.reset();
});
