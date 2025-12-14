const containerEl = document.getElementById('container');
const registreBtn =document.getElementById('registre');
const loginBtm=document.getElementById('login');

registreBtn.addEventListener('click',()=> 
    containerEl.classList.add("active"),
)

loginBtm.addEventListener('click',()=> 
    containerEl.classList.remove("active"),
)