const restaurant_area = document.querySelector('.restaurant-gallery');

let restaurants = [];
let nextRestaurantId = 1;
if (!restaurant_area) {
    console.log('Element .restaurant-gallery introuvable dans le DOM');
} else {
    fetch('../data/restaurant.json')
        .then(response => response.json())
        .then(data => {
            restaurants = data.restaurants || [];
            // compute next id
            const maxId = restaurants.length ? Math.max(...restaurants.map(r => Number(r.id) || 0)) : 0;
            nextRestaurantId = maxId ? maxId + 1 : nextRestaurantId;
            afficherRestaurant(restaurants);
        })
        .catch(error => console.log('erreur Json: ' + error));
}


function afficherRestaurant(liste)
{
    restaurant_area.innerHTML="";

    liste.forEach(restaurant => {
            const gallery = document.createElement('div');
            gallery.classList.add('gallery');
            if (!restaurant.id) {
                restaurant.id = nextRestaurantId++;
            }
            gallery.dataset.id = restaurant.id;
            gallery.id = `rest-${restaurant.id}`;

            const info = document.createElement('p');
            info.classList.add('info');
            info.textContent = `Id: ${restaurant.id}; nom: ${restaurant.nom};  adresse: ${restaurant.adresse}`;
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
            id: nextRestaurantId++,
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

// delegated click handler: populate form when clicking a gallery item
if (restaurant_area) {
    restaurant_area.addEventListener('click', function(e) {
        const gallery = e.target.closest('.gallery');
        if (!gallery) return;
        const id = Number(gallery.dataset.id);
        const rest = restaurants.find(r => Number(r.id) === id);
        if (!rest) return;
        const rNom = document.getElementById('rNom');
        const rAdresse = document.getElementById('rAdresse');
        const rTable = document.getElementById('rTable');
        if (rNom) rNom.value = rest.nom || '';
        if (rAdresse) rAdresse.value = rest.adresse || '';
        if (rTable) rTable.value = rest.tables || 0;
    });
}