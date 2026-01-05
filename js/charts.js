let ctx = document.getElementById('courbe').getContext('2d');
let economie=[];
let category= [];
let categoryInfo=[];

let mois=['Jan' , 'Fev', 'Mar', 'Avr', 'Mai', 'juin' ,'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'];

//chart lineaire de l'economie (rapport recette - depenmse )
fetch('./data/economie_mounthly.json')
    .then(response => response.json())
    .then(data => {
        economie = data["2025"].map(item => item.totale);
        let datas ={
    labels: mois,
    datasets:[{
        label: 'Economie',
        data: economie,
        backgroundColor: '#2e8b56a4',
        borderColor: '#2e8b56ff',
        borderWidth: 1
    }]
}

let ecoChart =new Chart(ctx ,{
    type: 'line',
    data : datas,
    options:{
        responsive: true,
        scales:
        {
            y:{
                beginAtZero : true
            }
        },
        plugins: {
            title: {
            display: true,
            text: 'Economie'
        }
    }
    }
})  
        
    }
    )
    .catch(error => console.log('Erreur JSON' + error));

// chart doughnut sur le nombre d'achat par categories
let favctx = document.getElementById('favDonnut').getContext('2d');
fetch('../data/repartition_ventes.json')
    .then(response => response.json())
    .then(data => {
        category = data.map(item => item.categorie);
        categoryInfo = data.map(item => item.total);

        let info={
            labels : category,
            datasets : [
            {
                label :'category faveur',
                data : categoryInfo,
                backgroundColor:  [
                    '#ff6384',
                    '#36a2eb',
                    '#ffcd56',
                    '#4bc0c0',
                    '#9966ff',
                    '#ff9f40'
                ]
            }
            ]
        }

        const favDonnut=new Chart(favctx,{
            type:'doughnut',
            data:info,
            options:{
                responsive : true
            }
        })
    })
    .catch(error => console.log('erreur doughnut'));


let recette = document.getElementById('recette').getContext('2d');

//chart bar de recette des anne 2024 2025 2026 
fetch('../data/recette_monthly.json')
    .then(response => response.json())
    .then(data =>
    {
        let recette24= data["2024"].map(temp => temp.totale);
        let recette25= data["2025"].map(temp => temp.totale);
        let recette26= data["2026"].map(temp => temp.totale);

        let datas ={
    labels: mois,
    datasets:[{
        label: 'recette 2024',
        data: recette24,
        backgroundColor: '#d9544f9e',
        borderColor: '#D9534F',
        borderWidth: 1
    },
    {
       label: 'recette 2025',
        data: recette25,
        backgroundColor: '#2e8b56a4',
        borderColor: '#2e8b56ff',
        borderWidth: 1 
    },
    {
        label: 'recette 2026',
        data: recette26,
        backgroundColor: '#2e648ba4',
        borderColor: '#2e648bff',
        borderWidth: 1  
    }

]
};

let recetteCharts =new Chart( recette,{
    type: 'bar',
    data : datas,
    options:{
        responsive: true,
        scales:
        {
            y:{
                beginAtZero : true
            }
        },
        plugins: {
            title: {
            display: true,
            text: 'recette'
        }
    }
    }
})         
    }
    )
    .catch(error => console.log(`erreur recette`));

//chart bar de depense des anne 2024 2025 2026 
const depense = document.getElementById('depense').getContext('2d');
fetch('../data/depense_monthly.json')
    .then(response => response.json())
    .then(data =>
        {
        let depense24= data["2024"].map(temp => temp.totale);
        let depense25= data["2025"].map(temp => temp.totale);
        let depense26= data["2026"].map(temp => temp.totale);

        let datas ={
    labels: mois,
    datasets:[{
        label: 'depense 2024',
        data:   depense24,
        backgroundColor: '#d9544f9e',
        borderColor: '#D9534F',
        borderWidth: 1
    },
    {
       label: 'depense 2025',
        data: depense25,
        backgroundColor: '#2e8b56a4',
        borderColor: '#2e8b56ff',
        borderWidth: 1 
    },
    {
        label: 'depense 2026',
        data: depense26,
        backgroundColor: '#2e648ba4',
        borderColor: '#2e648bff',
        borderWidth: 1  
    }

]
};

let depenseCharts =new Chart( depense,{
    type: 'bar',
    data : datas,
    options:{
        responsive: true,
        scales:
        {
            y:{
                beginAtZero : true
            }
        },
        plugins: {
            title: {
            display: true,
            text: 'depense'
        }
    }
    }
})         
    }
    )
    .catch(error => console.log(`erreur recette`+error));

//Rapport economique de chaque restaurant 

const restoCanvas = document.getElementById('resto-courbe');
if (!restoCanvas) {
    console.error("Canvas avec l'id 'resto-courbe' introuvable. Aucune courbe restaurant affichée.");
} else {
    const restaurants = restoCanvas.getContext('2d');

    fetch('../data/restaurant_commerce.json')
        .then(response => response.json())
        .then(data => {
            const Rlabels = data.map(item => item.nom || '');
            const Rtotal = data.map(item => Number(item.totale) || 0);

            const dataCfg = {
                labels: Rlabels,
                datasets: [{
                    label: 'Rapport recette depense Restaurant',
                    data: Rtotal,
                    backgroundColor: '#2e648ba4',
                    borderColor: '#2e648bff',
                    borderWidth: 1
                }]
            };

            new Chart(restaurants, {
                type: 'bar',
                data: dataCfg,
                options: {
                    responsive: true,
                    scales: {
                        y: { beginAtZero: true }
                    },
                    plugins: {
                        title: { display: true, text: 'Rapport economie Restaurants' }
                    }
                }
            });
        })
        .catch(error => console.error('Erreur JSON restaurant:', error));
}
    