const empTable = document.querySelector('.employe-info tbody');
const empForm = document.getElementById('employe-form');
const searchInput = document.getElementById('search-input');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');
const itemsPerPageSelect = document.getElementById('items-per-page');

let employes = [];
let employesFiltres = []; // Liste filtrée par la recherche
let employeSelected = null;
let nextMatricule = 1003;

// Variables de pagination
let currentPage = 1;
let itemsPerPage = 10;

// Charger les données
fetch('../data/employe.json')
  .then(res => res.json())
  .then(data => {
    employes = data.employes || [];
    employesFiltres = [...employes];
    afficherEmployes();
  });

// Fonction d'affichage avec pagination
function afficherEmployes() {
  empTable.innerHTML = '';

  // Calculer les indices de début et fin
  const debut = (currentPage - 1) * itemsPerPage;
  const fin = debut + itemsPerPage;
  const employesPage = employesFiltres.slice(debut, fin);

  // Afficher les employés de la page courante
  employesPage.forEach(emp => {
    const tr = document.createElement('tr');
    tr.dataset.matricule = emp.matricule;

    tr.innerHTML = `
      <td>${emp.nom}</td>
      <td>${emp.prenom}</td>
      <td>${emp.cin}</td>
      <td>${emp.salaire}</td>
      <td>
        <button class="modifier" data-matricule="${emp.matricule}">Modifier</button>
        <button class="supprimer" data-matricule="${emp.matricule}">Supprimer</button>
      </td>
    `;

    empTable.appendChild(tr);
  });

  // Mettre à jour les infos de pagination
  updatePaginationInfo();
}

// Mettre à jour les informations de pagination
function updatePaginationInfo() {
  const totalPages = Math.ceil(employesFiltres.length / itemsPerPage);
  pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;

  // Désactiver les boutons si nécessaire
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage >= totalPages || totalPages === 0;
}

// Fonction de recherche
function rechercherEmployes() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  if (searchTerm === '') {
    employesFiltres = [...employes];
  } else {
    employesFiltres = employes.filter(emp => 
      emp.nom.toLowerCase().includes(searchTerm) ||
      emp.prenom.toLowerCase().includes(searchTerm) ||
      emp.cin.toLowerCase().includes(searchTerm)
    );
  }

  // Réinitialiser à la page 1 après recherche
  currentPage = 1;
  afficherEmployes();
}

// Événement de recherche
searchInput.addEventListener('input', rechercherEmployes);

// Navigation pagination
prevBtn.addEventListener('click', function() {
  if (currentPage > 1) {
    currentPage--;
    afficherEmployes();
  }
});

nextBtn.addEventListener('click', function() {
  const totalPages = Math.ceil(employesFiltres.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    afficherEmployes();
  }
});

// Changement du nombre d'items par page
itemsPerPageSelect.addEventListener('change', function() {
  itemsPerPage = Number(this.value);
  currentPage = 1; // Retour à la première page
  afficherEmployes();
});

// Préparation de la modification et suppression
empTable.addEventListener('click', function (e) {
  const matricule = Number(e.target.dataset.matricule);
  if (!matricule) return;

  // Modification
  if (e.target.classList.contains('modifier')) {
    employeSelected = employes.find(emp => emp.matricule === matricule);
    if (!employeSelected) return;

    document.getElementById('name').value = employeSelected.nom;
    document.getElementById('prenom').value = employeSelected.prenom;
    document.getElementById('CIN').value = employeSelected.cin;
    document.getElementById('tel').value = employeSelected.tel;
    document.getElementById('email').value = employeSelected.email;
    document.getElementById('salaire').value = employeSelected.salaire;
  }

  // Suppression
  if (e.target.classList.contains('supprimer')) {
    employes = employes.filter(emp => emp.matricule !== matricule);
    rechercherEmployes(); // Re-filtrer et afficher
  }
});

// Ajout / mise à jour (modification)
empForm.addEventListener('submit', function (e) {
  e.preventDefault();

  if (employeSelected === null) {
    // AJOUT
    const nouvelEmploye = {
      matricule: nextMatricule++,
      nom: document.getElementById('name').value,
      prenom: document.getElementById('prenom').value,
      cin: document.getElementById('CIN').value,
      tel: document.getElementById('tel').value,
      email: document.getElementById('email').value,
      salaire: Number(document.getElementById('salaire').value)
    };
    employes.push(nouvelEmploye);
  } else {
    // MODIFICATION
    employeSelected.nom = document.getElementById('name').value;
    employeSelected.prenom = document.getElementById('prenom').value;
    employeSelected.cin = document.getElementById('CIN').value;
    employeSelected.tel = document.getElementById('tel').value;
    employeSelected.email = document.getElementById('email').value;
    employeSelected.salaire = Number(document.getElementById('salaire').value);
    
    // Reset de l'employé sélectionné
    employeSelected = null;
  }

  rechercherEmployes(); // Re-filtrer et afficher
  empForm.reset();
});