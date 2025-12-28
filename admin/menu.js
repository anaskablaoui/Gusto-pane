const menu_are = document.querySelector('.menu-gallery');
let menu = [];
let nextMenuId = 1;

fetch('../data/menu.json')
    .then(response => response.json())
    .then(data => {
        menu = data.menu || [];
        const maxNo = menu.length ? Math.max(...menu.map(m => Number(m.no) || 0)) : 0;
        nextMenuId = maxNo ? maxNo + 1 : nextMenuId;
        afficherMenu(menu);
    })
    .catch(error => console.log(`erreur json ${error}`));


function afficherMenu(liste)
{
    menu_are.innerHTML="";
    liste.forEach(menuItem => {
            const gallery = document.createElement('div');
            gallery.classList.add('gallery');
            if (!menuItem.no) {
                menuItem.no = nextMenuId++;
            }
            gallery.dataset.no = menuItem.no;
            gallery.id = `menu-${menuItem.no}`;

            const info = document.createElement('p');
            info.classList.add('info');
            info.textContent = `${menuItem.nom}; | prix: ${menuItem.prix}`;
            gallery.appendChild(info);
            menu_are.appendChild(gallery);
    });
    
}

const menu_form = document.getElementById('menu-form');
if (menu_form) {
    menu_form.addEventListener('submit', function(e) {
        e.preventDefault();

        const nom = document.getElementById('nom') ? document.getElementById('nom').value : '';
        const prix = document.getElementById('prix') ? document.getElementById('prix').value : 0;
        const categoryRadios = document.querySelectorAll('input[name="category"]');
        let category = '';
        categoryRadios.forEach(r => { if (r.checked) category = r.id; });

        const nv_menu = {
            no: nextMenuId++,
            nom: nom,
            prix: prix,
            category: category
        };
        menu.push(nv_menu);
        afficherMenu(menu);
        menu_form.reset();
    });
}

// delegated click handler for menu gallery: populate form and select category radio if possible
if (menu_are) {
    menu_are.addEventListener('click', function(e) {
        const gallery = e.target.closest('.gallery');
        if (!gallery) return;
        const no = Number(gallery.dataset.no);
        const item = menu.find(m => Number(m.no) === no);
        if (!item) return;

        const nom = document.getElementById('nom');
        const prix = document.getElementById('prix');
        if (nom) nom.value = item.nom || '';
        if (prix) prix.value = item.prix || '';

        // try to select matching category radio by id (best-effort)
        const cat = (item.category || item.nom || '').toString().toLowerCase();
        document.querySelectorAll('input[name="category"]').forEach(r => {
            r.checked = (r.id.toLowerCase() === cat);
        });
    });
}


