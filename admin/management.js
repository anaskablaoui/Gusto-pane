const buttons =document.querySelectorAll('.sidebar button');
const pannels=document.querySelectorAll('.panel');

buttons.forEach( btn=>{
    btn.addEventListener('click', ()=>{
        pannels.forEach(p => p.classList.remove('active'));
        const target= btn.dataset.target;
        document.getElementById(target).classList('active');
    });
})