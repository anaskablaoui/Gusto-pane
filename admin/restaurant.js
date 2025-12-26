const restaurant_area=document.querySelector('.restaurant-gallery');

let restaurants=[];
fetch('../data/restaurant.json')
    .then(response => response.json())
    .then (data => {
        restaurants=data.restaurants;
        afficherRestaurant(restaurants);
    })
    .catch(error => console.log('erreur Json' +error))


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

const menuForm =document.getElementById('menu-form');

menuForm.addEventListener('submit',function (e)
{
    e.preventDefault();
    const nom=document.getElementById('rNom').value;
    const adress=document.getElementById('rAdresse').value;
    const table=document.getElementById('rTable').value;
    const nv_restau={
        id:Math.random(),
        nom : nom,
        adresse: adress,
        tables: table
    };
    restaurants.push(nv_restau);
    afficherRestaurant(restaurants);
});