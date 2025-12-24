const menu_are=document.querySelector('.menu-gallery');

fetch('../data/menu.json')
    .then(response => response.json())
    .then( data =>
    {
        data.menu.forEach(menu => {
                const gallery=document.createElement('div');
                gallery.classList.add('gallery');
            
                const info=document.createElement('p');
                info.classList.add('info');
                info.textContent=`${menu.nom};|prix: ${menu.prix}`;
                gallery.appendChild(info);
                menu_are.appendChild(gallery);
        });
    }
    )
    .catch( error=> console.log(`errure JSON: ${error}`));

    