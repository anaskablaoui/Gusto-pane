const employe_area = document.querySelector(".employe-gallery");
let employes = [];

fetch('../data/employe.json')
  .then(response => response.json())
  .then(data => {
    employes = data.employes;
    afficherEmployes(employes);
  })
  .catch(error => console.log('erreur json ' + error));

function afficherEmployes(liste) {
  employe_area.innerHTML = "";

  liste.forEach(employe => {
    const gallery = document.createElement('div');
    gallery.classList.add('gallery');

    const img_div = document.createElement('div');
    img_div.classList.add('img');

    const img = document.createElement('img');
    img.src = `../images/${employe.photo}`;
    img.alt = employe.nom;

    img_div.appendChild(img);

    const info = document.createElement('div');
    info.classList.add('info');

    const p = document.createElement('p');
    p.textContent = `Nom: ${employe.nom} | Prénom: ${employe.prenom} | Salaire: ${employe.salaire} DH`;

    info.appendChild(p);

    gallery.appendChild(img_div);
    gallery.appendChild(info);

    employe_area.appendChild(gallery);
  });
}

const empForm = document.getElementById('employe-form');

empForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const fonctions = [];
  document.querySelectorAll('.fonction:checked').forEach(f => {
    fonctions.push(f.id);
  });

  const nv_employe = {
    matricule: Math.random(),
    nom: document.getElementById('name').value,
    prenom: document.getElementById('prenom').value,
    cin: document.getElementById('CIN').value,
    tel: document.getElementById('tel').value,
    email: document.getElementById('email').value,
    salaire: document.getElementById('salaire').value,
    photo: "default.png", // image par défaut
    fonction: fonctions
  };

  employes.push(nv_employe);
  afficherEmployes(employes);
});
