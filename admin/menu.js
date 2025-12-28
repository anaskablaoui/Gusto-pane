const menu_are=document.querySelector('.menu-gallery');
let menu=[];

fetch('../data/menu.json')
    .then( response => response.json())
    .then( data =>
    {
    menu=data.menu;
    afficherMenu(menu);
    }
    )
    .catch(error => console.log(`erreur json ${error}`));


function afficherMenu(liste)
{
    menu_are.innerHTML="";

    liste.forEach( menu =>
    {
            const gallery=document.createElement('div');
            gallery.classList.add('gallery');
        
            const info=document.createElement('p');
            info.classList.add('info');
            info.textContent=`${menu.nom};|prix: ${menu.prix}`;
            gallery.appendChild(info);
            menu_are.appendChild(gallery);
    }
    )
    
}

const menu_form=document.getElementById('menu-form');

menu_form.addEventListener('submit', function(e)
{
    e.preventDefault();

    const nv_menu = {
        no:Math.random(),
        nom:document.getElementById('nom').value,
        prix:document.getElementById('prix').value
    }
    menu.push(nv_menu);
    afficherMenu(menu);
})


