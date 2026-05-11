let icons = [
    "iconHTML",
    "iconCSS",
    "iconJS",
    "iconBancoDados",
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

}

async function CotemigIconAnimation() {
    while (true) {
        randomArray()
        for (let i = 0; i < icons.length; i++) {

            const icon = document.getElementById(icons[i]);

            icon.style.animation = "pulsando 2s ease-in-out";

            await new Promise(resolve => setTimeout(resolve, 2000));

            icon.style.animation = "";

        }
    }
}

CotemigIconAnimation()