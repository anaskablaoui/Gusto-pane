const tableBody = document.querySelector('.restaurant-gallery tbody');
const form = document.getElementById('restaurant-form');

const rNom = document.getElementById('rNom');
const rAdresse = document.getElementById('rAdresse');
const rTable = document.getElementById('rTable');
const tableValue = document.getElementById('table-value');

let restaurants = [];
let restoSelected = null;
let nextId = 1;

/* slider */
rTable.addEventListener('input', () => {
  tableValue.textContent = rTable.value;
});

/* fetch JSON */
fetch('../data/restaurants.json')
  .then(res => res.json())
  .then(data => {
    restaurants = data.restaurants || [];
    nextId = restaurants.length
      ? Math.max(...restaurants.map(r => r.id)) + 1
      : 1;

    afficher();
  })
  .catch(err => console.error(err));

function afficher() {
  tableBody.innerHTML = '';

  restaurants.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.nom}</td>
      <td>${r.adresse}</td>
      <td>${r.tables}</td>
      <td>
        <button class="edit" data-id="${r.id}">✏️</button>
        <button class="del" data-id="${r.id}">🗑</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

/* modifier / supprimer */
tableBody.addEventListener('click', e => {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  if (e.target.classList.contains('edit')) {
    restoSelected = restaurants.find(r => r.id === id);
    rNom.value = restoSelected.nom;
    rAdresse.value = restoSelected.adresse;
    rTable.value = restoSelected.tables;
    tableValue.textContent = restoSelected.tables;
  }

  if (e.target.classList.contains('del')) {
    restaurants = restaurants.filter(r => r.id !== id);
    afficher();
  }
});

/* submit */
form.addEventListener('submit', e => {
  e.preventDefault();

  if (restoSelected) {
    restoSelected.nom = rNom.value;
    restoSelected.adresse = rAdresse.value;
    restoSelected.tables = rTable.value;
    restoSelected = null;
  } else {
    restaurants.push({
      id: nextId++,
      nom: rNom.value,
      adresse: rAdresse.value,
      tables: rTable.value
    });
  }

  form.reset();
  tableValue.textContent = 0;
  afficher();
});
