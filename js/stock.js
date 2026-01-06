const stockTable = document.querySelector('#stock-table tbody');
if(!stockTable) return ;
const stockForm = document.getElementById('stock-form');
const searchStockInput = document.getElementById('search-stock');
const prevBtnStock = document.getElementById('prev-page-stock');
const nextBtnStock = document.getElementById('next-page-stock');
const pageInfoStock = document.getElementById('page-info-stock');
const itemsPerPageStockSelect = document.getElementById('items-per-page-stock');

let stock = [];
let stockFiltre = []; // Liste filtrée par la recherche
let stockSelected = null;
let nextNo = 11;

// Variables de pagination
let currentPageStock = 1;
let itemsPerPageStock = 10;

// Charger les données
fetch('./data/stock.json')
  .then(response => response.json())
  .then(data => {
    stock = data.stock || [];
    stockFiltre = [...stock];
    
    // Calculer le prochain numéro
    if (stock.length > 0) {
      const maxNo = Math.max(...stock.map(s => s.no));
      nextNo = maxNo + 1;
    } else {
      nextNo = 1;
    }
    
    afficherStock();
  })
  .catch(error => console.log(`Erreur JSON stock: ${error}`));

// Fonction d'affichage avec pagination
function afficherStock() {
  stockTable.innerHTML = '';

  // Calculer les indices de début et fin
  const debut = (currentPageStock - 1) * itemsPerPageStock;
  const fin = debut + itemsPerPageStock;
  const stockPage = stockFiltre.slice(debut, fin);

  // Afficher les stocks de la page courante
  stockPage.forEach(item => {
    const tr = document.createElement('tr');
    tr.dataset.no = item.no;

    tr.innerHTML = `
      <td>${item.no}</td>
      <td>${item.produit}</td>
      <td>${item.qte_stock}</td>
      <td>
        <button class="modifier" data-no="${item.no}">Modifier</button>
        <button class="supprimer" data-no="${item.no}">Supprimer</button>
      </td>
    `;

    stockTable.appendChild(tr);
  });

  // Mettre à jour les infos de pagination
  updatePaginationInfoStock();
}

// Mettre à jour les informations de pagination
function updatePaginationInfoStock() {
  const totalPages = Math.ceil(stockFiltre.length / itemsPerPageStock);
  pageInfoStock.textContent = `Page ${currentPageStock} / ${totalPages}`;

  // Désactiver les boutons si nécessaire
  prevBtnStock.disabled = currentPageStock === 1;
  nextBtnStock.disabled = currentPageStock >= totalPages || totalPages === 0;
}

// Fonction de recherche
function rechercherStock() {
  const searchTerm = searchStockInput.value.toLowerCase().trim();

  if (searchTerm === '') {
    stockFiltre = [...stock];
  } else {
    stockFiltre = stock.filter(item => 
      item.produit.toLowerCase().includes(searchTerm)
    );
  }

  // Réinitialiser à la page 1 après recherche
  currentPageStock = 1;
  afficherStock();
}

// Événement de recherche
searchStockInput.addEventListener('input', rechercherStock);

// Navigation pagination
prevBtnStock.addEventListener('click', function() {
  if (currentPageStock > 1) {
    currentPageStock--;
    afficherStock();
  }
});

nextBtnStock.addEventListener('click', function() {
  const totalPages = Math.ceil(stockFiltre.length / itemsPerPageStock);
  if (currentPageStock < totalPages) {
    currentPageStock++;
    afficherStock();
  }
});

// Changement du nombre d'items par page
itemsPerPageStockSelect.addEventListener('change', function() {
  itemsPerPageStock = Number(this.value);
  currentPageStock = 1; // Retour à la première page
  afficherStock();
});

// Modifier / Supprimer
stockTable.addEventListener('click', function (e) {
  const no = Number(e.target.dataset.no);

  if (!no) return;

  // Modifier
  if (e.target.classList.contains('modifier')) {
    stockSelected = stock.find(m => m.no === no);
    if (!stockSelected) return;

    document.getElementById('pr_nom').value = stockSelected.produit;
    document.getElementById('sQte').value = stockSelected.qte_stock;
  }

  // Supprimer 
  if (e.target.classList.contains('supprimer')) {
    stock = stock.filter(s => s.no !== no);
    
    // Reset formulaire si on supprime l'élément sélectionné
    if (stockSelected && stockSelected.no === no) {
      stockSelected = null;
      stockForm.reset();
    }
    
    rechercherStock(); // Re-filtrer et afficher
  }
});

// Ajouter / Mettre à jour 
stockForm.addEventListener('submit', function(e) {
  e.preventDefault();

  if (stockSelected === null) {
    // AJOUT
    const newStock = {
      no: nextNo++,
      produit: document.getElementById('pr_nom').value,
      qte_stock: Number(document.getElementById('sQte').value)
    };
    stock.push(newStock);
  } else {
    // MODIFICATION
    stockSelected.produit = document.getElementById('pr_nom').value;
    stockSelected.qte_stock = Number(document.getElementById('sQte').value);

    stockSelected = null;
  }

  rechercherStock(); // Re-filtrer et afficher
  stockForm.reset();
});