const employe_area = document.querySelector(".employe-gallery");

fetch('../data/employe.json')
  .then(response => response.json())
  .then(data => {
    data.employes.forEach(employe => {

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
  })
  .catch(error => console.error("Erreur JSON :", error));
