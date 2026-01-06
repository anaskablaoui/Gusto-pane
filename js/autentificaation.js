let admins = [];

fetch('../data/admin.json')
    .then(response => response.json())
    .then(data => {
        admins = data; // selon la structure du JSON
    })
    .catch(error => console.log('Erreur JSON : ' + error));

const authentification = document.getElementById('authentification');

authentification.addEventListener('submit', function (e) {
    e.preventDefault();

    //prendre les valeur saisie au clavier 
    const matricule = document.getElementById('Matricule').value.trim();
    const password = document.getElementById('password').value.trim();

    // chercher un admin correspondant
    const adminTrouve = admins.find(admin =>
        admin.matricule == matricule && admin.password === password
    );

    if (adminTrouve) {
        // authentification reussite 
        window.location.href = 'content.html';
    } else {
        // Erreur d'authentificaation
        alert('Matricule ou mot de passe incorrect');
    }
});
