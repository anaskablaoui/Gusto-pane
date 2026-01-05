//code de transition pour la navigationm bar

const selectors = document.querySelectorAll('.selection');
const articles = document.querySelectorAll('.panel');

selectors.forEach(selector => {
    selector.addEventListener('click', (e) => {
        e.preventDefault();

        const choose = selector.dataset.target;

        articles.forEach(article => {
            article.classList.toggle(
                'active',
                article.id === choose
            );
        });
    });
});

