
let likebtn = document.getElementById('likebtn')
let dataholder = document.getElementById('dataholder')

function clickCounter() {
    if (localStorage.clickcount) {
        localStorage.clickcount = Number(localStorage.clickcount) + 1;
    } else {
        localStorage.clickcount = 1;
    }
    dataholder.innerHTML = localStorage.clickcount;
}



