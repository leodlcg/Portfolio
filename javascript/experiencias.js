let icons = [
    "IconHTML",
    "IconCSS",
    "IconJS",
    "IconBancoDados",
    "iconPhp",
    "iconCotemig",
    "iconLogicaProgramacao",
    "iconCSharp",
    "iconMobile"
]


function randomIndex() {
    
    return Math.floor(Math.random() * icons.length);

}

function randomArray(){

    for(let i = 0 ; i < icons.length; i++){

        let index01 = randomIndex();
        let index02 = randomIndex();
        let icons01 = icons[index01];
        let icons02 = icons[index02];
        icons[index01] = icons02
        icons[index02] = icons01

    }

    icons.push("final")

    randomPulsandoAnimation()

}

function randomPulsandoAnimation() {
    
    for(let i = 0; i < icons.length; i++){

        if(icons[i] == "final"){

            randomArray()

        }

        setTimeout(
    
        document.getElementById(icons[i]).style.animation = "pulsando 2.5s ease-in-out infinite"
        
        , 100)

    }

}


randomArray()