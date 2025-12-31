const empTable = document.querySelector('.employe-info tbody');
const empForm = document.getElementById('employe-form');

let employes = [];
let employeSelected = null;
let nextMatricule = 1003;

/* ===== Charger données ===== */
fetch('../data/employe.json')
  .then(res => res.json())
  .then(data => {
    employes = data.employes || [];
    afficherEmployes(employes);
  });

/* ===== Affichage ===== */
function afficherEmployes(liste) {
  empTable.innerHTML = '';

  liste.forEach(emp => {
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
}

/* ===== Délégation événements (modifier / supprimer) ===== */
empTable.addEventListener('click', function (e) {
  const matricule = Number(e.target.dataset.matricule);
  if (!matricule) return;

  /* MODIFIER */
  if (e.target.classList.contains('modifier')) {
    employeSelected = employes.find(emp => emp.matricule === matricule);
    if (!employeSelected) return;

    document.getElementById('name').value = employeSelected.nom;
    document.getElementById('prenom').value = employeSelected.prenom;
    document.getElementById('CIN').value = employeSelected.cin;
    document.getElementById('tel').value = employeSelected.tel;
    document.getElementById('email').value = employeSelected.email;
    document.getElementById('salaire').value = employeSelected.salaire;

    document.querySelectorAll('.fonction').forEach(cb => cb.checked = false);
    (employeSelected.fonction || []).forEach(f => {
      const checkbox = document.getElementById(f);
      if (checkbox) checkbox.checked = true;
    });
  }

  /* SUPPRIMER */
  if (e.target.classList.contains('supprimer')) {
    employes = employes.filter(emp => emp.matricule !== matricule);
    afficherEmployes(employes);
  }
});

/* ===== Ajouter / Mettre à jour ===== */
empForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const fonctions = [];
  document.querySelectorAll('.fonction:checked').forEach(cb => {
    fonctions.push(cb.id);
  });

  if (employeSelected === null) {
    // AJOUT
    const nouvelEmploye = {
      matricule: nextMatricule++,
      nom: document.getElementById('name').value,
      prenom: document.getElementById('prenom').value,
      cin: document.getElementById('CIN').value,
      tel: document.getElementById('tel').value,
      email: document.getElementById('email').value,
      salaire: document.getElementById('salaire').value,
      fonction: fonctions
    };
    employes.push(nouvelEmploye);
  } else {
    // MODIFICATION
    employeSelected.nom = document.getElementById('name').value;
    employeSelected.prenom = document.getElementById('prenom').value;
    employeSelected.cin = document.getElementById('CIN').value;
    employeSelected.tel = document.getElementById('tel').value;
    employeSelected.email = document.getElementById('email').value;
    employeSelected.salaire = document.getElementById('salaire').value;
    employeSelected.fonction = fonctions;

    employeSelected = null;
  }

  afficherEmployes(employes);
  empForm.reset();
});
