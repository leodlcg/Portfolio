const skills = [
  { skill: "C", peso: 4 },
  { skill: "Arquitetura", peso: 3 },
  { skill: "CSS", peso: 5 },
  { skill: "JavaScript", peso: 5 },
  { skill: "Spring", peso: 5 },
  { skill: "ReactNative", peso: 5 },
  { skill: "React", peso: 6 },
  { skill: "HTML", peso: 5 },
  { skill: "Frontend", peso: 7 },
  { skill: "SpringBoot", peso: 8 },
  { skill: "Backend", peso: 8 },
  { skill: "POO", peso: 8 },
  { skill: "Java", peso: 10 },
  { skill: "Inglês", peso: 7 },
  { skill: "BancoDados", peso: 5 },
  { skill: "SistemasDistribuídos", peso: 5 },
  { skill: "QualidadeSoftware", peso: 4 },
  { skill: "Redes", peso: 4 },
  { skill: "Requisitos", peso: 5 },
  { skill: "Processos", peso: 5 },
  { skill: "ProjetoSistemas", peso: 5 },
  { skill: "SistemasOperacionais", peso: 3 },
  { skill: "EstruturaDados", peso: 5 },
  { skill: "Python", peso: 4 },
];

function randomMargens() {
    
    return Math.random() * (30 - 5) + 5

}

function randomIndex() {
    
    return Math.floor(Math.random() * skills.length);

}

function randomArray(){

    for(let i = 0 ; i < skills.length; i++){

        let index01 = randomIndex();
        let index02 = randomIndex();
        let skill01 = skills[index01];
        let skill02 = skills[index02];
        skills[index01] = skill02
        skills[index02] = skill01

    }

}

randomArray()
for(let i = 0 ; i < document.querySelectorAll(".subject").length; i++){

    let subject = document.getElementById(`subject${i}`)
    subject.style.marginLeft = randomMargens() + "px"

    let text = document.createTextNode(`${skills[i].skill}`)
    subject.appendChild(text)
    subject.style.fontSize = `max(${skills[i].peso * 0.4}vw, ${skills[i].peso * 5}px)`

}