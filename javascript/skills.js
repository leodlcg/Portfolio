


function randomMargens() {
    
    return Math.random() * (50 - 10) + 10

}

for(let i = 0 ; i < document.querySelectorAll(".subject").length; i++){

    let subject = document.getElementById(`subject${i}`)
    subject.style.marginLeft = randomMargens() + "px"
    subject.style.marginTop = randomMargens() + "px"

}