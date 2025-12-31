const menuTable = document.querySelector('.menu-gallery tbody');
const menuForm = document.getElementById('menu-form');

let menu = [];
let menuSelected = null;
let nextMenuId = 1;

/* ===== Charger JSON ===== */
fetch('../data/menu.json')
  .then(res => res.json())
  .then(data => {
    menu = data.menu || [];

    const maxId = menu.length
      ? Math.max(...menu.map(m => Number(m.no)))
      : 0;

    nextMenuId = maxId + 1;
    afficherMenu(menu);
  })
  .catch(err => console.log('Erreur JSON', err));

/* ===== Affichage ===== */
function afficherMenu(liste) {
  menuTable.innerHTML = '';

  liste.forEach(item => {
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
}

/* ===== Modifier / Supprimer (délégation) ===== */
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
    afficherMenu(menu);
  }
});

/* ===== Ajouter / Mettre à jour ===== */
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
      prix: document.getElementById('prix').value,
      category: category
    };
    menu.push(newMenu);
  } else {
    // MODIFICATION
    menuSelected.nom = document.getElementById('nom').value;
    menuSelected.prix = document.getElementById('prix').value;
    menuSelected.category = category;

    menuSelected = null;
  }

  afficherMenu(menu);
  menuForm.reset();
});
