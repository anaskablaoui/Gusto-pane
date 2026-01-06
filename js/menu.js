const menuTable = document.querySelector('.menu-gallery tbody');
const menuForm = document.getElementById('menu-form');
const searchMenuInput = document.getElementById('search-menu');
const prevBtnMenu = document.getElementById('prev-page-menu');
const nextBtnMenu = document.getElementById('next-page-menu');
const pageInfoMenu = document.getElementById('page-info-menu');
const itemsPerPageMenuSelect = document.getElementById('items-per-page-menu');

let menu = [];
let menuFiltre = []; // Liste filtrée par la recherche
let menuSelected = null;
let nextMenuId = 1;

// Variables de pagination
let currentPageMenu = 1;
let itemsPerPageMenu = 10;

// Charger les données de fichier json 
fetch('../data/menu.json')
  .then(res => res.json())
  .then(data => {
    menu = data.menu || [];
    menuFiltre = [...menu];

    const maxId = menu.length
      ? Math.max(...menu.map(m => Number(m.no)))
      : 0;

    nextMenuId = maxId + 1;
    afficherMenu();
  })
  .catch(err => console.log('Erreur JSON', err));

// Fonction d'affichage avec pagination
function afficherMenu() {
  menuTable.innerHTML = '';

  // Calculer les indices de début et fin
  const debut = (currentPageMenu - 1) * itemsPerPageMenu;
  const fin = debut + itemsPerPageMenu;
  const menuPage = menuFiltre.slice(debut, fin);

  // Afficher les items du menu de la page courante
  menuPage.forEach(item => {
    const tr = document.createElement('tr');
    tr.dataset.no = item.no;

    tr.innerHTML = `
      <td>${item.nom}</td>
      <td>${item.prix} DH</td>
      <td>${item.category || '-'}</td>
      <td>
        <button class="modifier" data-no="${item.no}">Modifier</button>
        <button class="supprimer" data-no="${item.no}">Supprimer</button>
      </td>
    `;

    menuTable.appendChild(tr);
  });

  // Mettre à jour les infos de pagination
  updatePaginationInfoMenu();
}

// Mettre à jour les informations de pagination
function updatePaginationInfoMenu() {
  const totalPages = Math.ceil(menuFiltre.length / itemsPerPageMenu);
  pageInfoMenu.textContent = `Page ${currentPageMenu} / ${totalPages}`;

  // Désactiver les boutons si nécessaire
  prevBtnMenu.disabled = currentPageMenu === 1;
  nextBtnMenu.disabled = currentPageMenu >= totalPages || totalPages === 0;
}

// Fonction de recherche
function rechercherMenu() {
  const searchTerm = searchMenuInput.value.toLowerCase().trim();

  if (searchTerm === '') {
    menuFiltre = [...menu];
  } else {
    menuFiltre = menu.filter(item => 
      item.nom.toLowerCase().includes(searchTerm) ||
      (item.category && item.category.toLowerCase().includes(searchTerm))
    );
  }

  // Réinitialiser à la page 1 après recherche
  currentPageMenu = 1;
  afficherMenu();
}

// Événement de recherche
searchMenuInput.addEventListener('input', rechercherMenu);

// Navigation pagination
prevBtnMenu.addEventListener('click', function() {
  if (currentPageMenu > 1) {
    currentPageMenu--;
    afficherMenu();
  }
});

nextBtnMenu.addEventListener('click', function() {
  const totalPages = Math.ceil(menuFiltre.length / itemsPerPageMenu);
  if (currentPageMenu < totalPages) {
    currentPageMenu++;
    afficherMenu();
  }
});

// Changement du nombre d'items par page
itemsPerPageMenuSelect.addEventListener('change', function() {
  itemsPerPageMenu = Number(this.value);
  currentPageMenu = 1; // Retour à la première page
  afficherMenu();
});

// Modifier / Supprimer
menuTable.addEventListener('click', function (e) {
  const no = Number(e.target.dataset.no);
  if (!no) return;

  /* MODIFIER */
  if (e.target.classList.contains('modifier')) {
    menuSelected = menu.find(m => m.no === no);
    if (!menuSelected) return;

    document.getElementById('nom').value = menuSelected.nom;
    document.getElementById('prix').value = menuSelected.prix;

    document.querySelectorAll('input[name="category"]').forEach(r => r.checked = false);
    if (menuSelected.category) {
      const radio = document.getElementById(menuSelected.category);
      if (radio) radio.checked = true;
    }
  }

  /* SUPPRIMER */
  if (e.target.classList.contains('supprimer')) {
    menu = menu.filter(m => m.no !== no);
    rechercherMenu(); // Re-filtrer et afficher
  }
});

// Ajout / mise à jour 
menuForm.addEventListener('submit', function (e) {
  e.preventDefault();

  let category = '';
  document.querySelectorAll('input[name="category"]').forEach(r => {
    if (r.checked) category = r.id;
  });

  if (menuSelected === null) {
    // AJOUT
    const newMenu = {
      no: nextMenuId++,
      nom: document.getElementById('nom').value,
      prix: Number(document.getElementById('prix').value),
      category: category
    };
    menu.push(newMenu);
  } else {
    // MODIFICATION
    menuSelected.nom = document.getElementById('nom').value;
    menuSelected.prix = Number(document.getElementById('prix').value);
    menuSelected.category = category;

    menuSelected = null;
  }

  rechercherMenu(); // Re-filtrer et afficher
  menuForm.reset();
});