const restaurant_area = document.querySelector('.restaurant-gallery');

let restaurants = [];
if (!restaurant_area) {
    console.log('Element .restaurant-gallery introuvable dans le DOM');
} else {
    fetch('../data/restaurant.json')
        .then(response => response.json())
        .then(data => {
            restaurants = data.restaurants || [];
            afficherRestaurant(restaurants);
        })
        .catch(error => console.log('erreur Json: ' + error));
}


function afficherRestaurant(liste)
{
    restaurant_area.innerHTML="";

    liste.forEach(restaurant=>
        {
            const gallery=document.createElement('div');
            gallery.classList.add('gallery');

            const info=document.createElement('p');
            info.classList.add('info');
            info.textContent=`Id: ${restaurant.id}; nom: ${restaurant.nom};  adresse: ${restaurant.adresse}`;
            gallery.appendChild(info);
            restaurant_area.appendChild(gallery);
        });
}

const restaurantForm = document.getElementById('restaurant-form');
if (restaurantForm) {
    restaurantForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const nom = document.getElementById('rNom') ? document.getElementById('rNom').value : '';
        const adresse = document.getElementById('rAdresse') ? document.getElementById('rAdresse').value : '';
        const table = document.getElementById('rTable') ? document.getElementById('rTable').value : 0;
        const nv_restau = {
            id: Math.random(),
            nom: nom,
            adresse: adresse,
            tables: table
        };
        restaurants.push(nv_restau);
        afficherRestaurant(restaurants);
        restaurantForm.reset();
    });
} else {
    console.log('Formulaire #restaurant-form introuvable — impossible d\'ajouter un restaurant depuis le formulaire.');
}