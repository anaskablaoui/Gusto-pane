const restaurant_area=document.querySelector('.restaurant-gallery');

fetch('../data/restaurant.json')
    .then(response => response.json())
    .then(data => 
        data.restaurants.forEach( restaurant=>
        {
            const gallery=document.createElement('div');
            gallery.classList.add('gallery');

            const info=document.createElement('p');
            info.classList.add('info');
            info.textContent=`Id: ${restaurant.id}; nom: ${restaurant.nom};  adresse: ${restaurant.adresse}`;
            gallery.appendChild(info);
            restaurant_area.appendChild(gallery);
        }
        )
    )
    .catch(error => console.log(`erreur json ${error}`));