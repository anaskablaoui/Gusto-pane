const employe_area = document.querySelector(".employe-gallery");
let employes = [];
let nextMatricule = 10001;
fetch('../data/employe.json')
  .then(response => response.json())
  .then(data => {
    employes = data.employes;
    // determine next matricule from data (fallback to 10001)
    const maxMat = employes.length ? Math.max(...employes.map(e => Number(e.matricule) || 0)) : 10000;
    nextMatricule = maxMat >= 10000 ? maxMat + 1 : nextMatricule;
    afficherEmployes(employes);
  })
  .catch(error => console.log('erreur json ' + error));

function afficherEmployes(liste) {
  employe_area.innerHTML = "";

  liste.forEach(employe => {
    const gallery = document.createElement('div');
    gallery.classList.add('gallery');
    // ensure every employe has a matricule
    if (!employe.matricule) {
      employe.matricule = nextMatricule++;
    }
    gallery.dataset.matricule = employe.matricule;
    gallery.id = `emp-${employe.matricule}`;
    

    const img_div = document.createElement('div');
    img_div.classList.add('img');

    const img = document.createElement('img');
    img.src = `../images/${employe.photo}`;
    img.alt = employe.nom;

    img_div.appendChild(img);

    const info = document.createElement('div');
    info.classList.add('info');

    const p = document.createElement('p');
    const fonctionText = Array.isArray(employe.fonction) ? employe.fonction.join(', ') : (employe.fonction || '');
    p.textContent = `Nom: ${employe.nom} | Prénom: ${employe.prenom} | Salaire: ${employe.salaire} DH | Fonction: ${fonctionText}`;

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
    matricule: nextMatricule++,
    nom: document.getElementById('name').value,
    prenom: document.getElementById('prenom').value,
    cin: document.getElementById('CIN').value,
    tel: document.getElementById('tel').value,
    email: document.getElementById('email').value,
    salaire: document.getElementById('salaire').value,
    photo: "default.png", 
    fonction: fonctions
  };

  employes.push(nv_employe);
  afficherEmployes(employes);
});



employe_area.addEventListener('click', function(e) {
  const gallery = e.target.closest('.gallery');
  if (!gallery) return;
  const idSelected = Number(gallery.dataset.matricule);

  const employe = employes.find(emp => Number(emp.matricule) === idSelected);
  if (!employe) return;

  // populate form fields (note: form uses id 'name' not 'nom')
  document.getElementById('name').value = employe.nom || '';
  document.getElementById('prenom').value = employe.prenom || '';
  document.getElementById('CIN').value = employe.cin || '';
  document.getElementById('tel').value = employe.tel || '';
  document.getElementById('email').value = employe.email || '';
  document.getElementById('salaire').value = employe.salaire || '';

  // handle fonction checkboxes: clear all, then check those that match
  const fonctions = Array.isArray(employe.fonction) ? employe.fonction : (employe.fonction ? [employe.fonction] : []);
  const lowerFonctions = fonctions.map(f => String(f).toLowerCase());
  document.querySelectorAll('.fonction').forEach(cb => {
    cb.checked = lowerFonctions.includes(cb.id.toLowerCase());
  });
});