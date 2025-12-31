
//
const employe_area = document.querySelector(".employe-gallery");
const empForm = document.getElementById('employe-form');

let employes = [];
let nextMatricule = 10003;
let employeSelected = null; //  employé en cours de modification


fetch('../data/employe.json')
  .then(response => response.json())
  .then(data => {
    employes = data.employes || [];

    const maxMat = employes.length
      ? Math.max(...employes.map(e => Number(e.matricule)))
      : 10000;

    nextMatricule = maxMat + 1;
    afficherEmployes(employes);
  })
  .catch(error => console.log('Erreur JSON : ' + error));


function afficherEmployes(liste) {
  employe_area.innerHTML = "";

  liste.forEach(employe => {
    const gallery = document.createElement('div');
    gallery.className = 'gallery';
    gallery.dataset.matricule = employe.matricule;

    const imgDiv = document.createElement('div');
    imgDiv.className = 'img';

    const img = document.createElement('img');
    img.src = `../images/${employe.photo || 'default.png'}`;
    img.alt = employe.nom;

    imgDiv.appendChild(img);

    const info = document.createElement('div');
    info.className = 'info';

    const fonctions = Array.isArray(employe.fonction)
      ? employe.fonction.join(', ')
      : employe.fonction;

    info.innerHTML = `
      <p>
        <strong>${employe.nom} ${employe.prenom}</strong><br>
        Fonction : ${fonctions}<br>
        Salaire : ${employe.salaire} DH
      </p>
    <button classe="supprimer" data-matricule="${employe.matricule}"> supprimer</button>
    <button classe="modifier" data-matricule="${employe.matricule} "> modifier </button>
    `;

    gallery.appendChild(imgDiv);
    gallery.appendChild(info);
    employe_area.appendChild(gallery);
  });
}

const modifier=document.querySelector('.modifier')

employe_area.addEventListener('click', function (e) {
  const gallery = e.target.closest('.gallery');
  if (!gallery) return;

  const matricule = Number(gallery.dataset.matricule);
  employeSelected = employes.find(emp => emp.matricule === matricule);
  if (!employeSelected) return;

  // remplir formulaire
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
});


empForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const fonctions = [];
  document.querySelectorAll('.fonction:checked').forEach(cb => {
    fonctions.push(cb.id);
  });

  if (employeSelected === null) {
    
    const nouvelEmploye = {
      matricule: nextMatricule++,
      nom: document.getElementById('name').value,
      prenom: document.getElementById('prenom').value,
      cin: document.getElementById('CIN').value,
      tel: document.getElementById('tel').value,
      email: document.getElementById('email').value,
      salaire: document.getElementById('salaire').value,
      photo: 'default.png',
      fonction: fonctions
    };
    employes.push(nouvelEmploye);
  } else {
    
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


let sup = document.querySelector('.supprimer');

sup.addEventListener('click', ()=>
{
  const index = employes.findIndex(emp => emp.matricule === sup.dataset.matricule);
  console.log(index);
  employes.splice(index,1);
  afficherEmployes(employes);
}
)