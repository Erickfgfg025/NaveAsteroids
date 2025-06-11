const canvas = document.getElementById("meuCanvas");
const ctx = canvas.getContext("2d");

let x=100;
let y=100;
let largura = 30;
let altura = 24;
let velocidade = 4;
let cima = false;
let left = false;
let right = false;
let baixo = false;
let gameOver = false;  //encerrar o jogo
canvas.width = window.innerWidth;
canvas.height =  window.innerHeight;

//carrega a imagem da nave
const nave = new Image();                     
nave.src="/imagens/nave.png";

//carrega a imagem de asterois
const imageAsteroids = new Image();
imageAsteroids.src = "/imagens/asteroids.png";

const asteroids = [];
const tiros = [];

//carrega os audios
trilha = new Audio("/sons/trilha-sonora.mp3"); 
trilhaTocando = false;

//ctx.fillStyle="white";
//ctx.fillRect(x,y,largura,altura);
document.addEventListener("keydown",function(event){
    if (event.key === "s" || event.key === "S") {
        baixo = true;   
    }
    if (event.key=== "w") {
        cima = true;
    }
    if (event.key==="a") {                                 
        left = true;
    }
    if (event.key==="d") {           
        right = true;                    
    }
    if (event.key===" ") {
        atirar();
    }
});                                          
                                                                                                     
document.addEventListener("keyup",function(event){
     if (event.key === "s" || event.key === "S") {
        baixo = false;

    }
    if (event.key === "w" || event.key === "W") {
        cima = false;
        
    }
    if (event.key === "a" || event.key === "A") {
        left = false;
        
    }
    if (event.key === "d" || event.key === "D") {
        right = false;
    }
        
});

function colidiu(a, b) {
    
    return a.x < b.x + b.largura &&
           a.x + a.largura > b.x &&
           a.y < b.y + b.altura &&
           a.y + a.altura > b.y;
    
}

function colisaoNave(a){
    return ( a.x < x + largura &&
           a.x + a.largura > x &&
           a.y < y + altura &&
           a.y + a.altura > y
    )

}

function draw() {
    
    trilhaSonora()
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //ctx.fillStyle="white";
    //ctx.fillRect(x,y,largura,altura);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(nave,x,y,largura,altura);
    
    //ctx.drawImage(imageAsteroids,a.x,a.y,a.largura,a.altura);

    if (cima) {
        y -= velocidade;

    }
    if (baixo) {
        y += velocidade;

    }
    if (left) {
        x -= velocidade;

    }
    if (right) {
        x += velocidade;

    }
    for (let j = 0; j < asteroids.length; j++) {
        const a = asteroids[j];
        
        a.y += a.velocidade;
        ctx.drawImage(imageAsteroids, a.x, a.y, a.largura, a.altura);
        

        // Remove asteroide se sair da tela
        if (a.y > canvas.height) {
            asteroids.splice(j, 1);
            j--;
        }
         if (colisaoNave(a)) {
                gameOver  = true;

        } 
    }

    for (let i=0; i<tiros.length; i++){
        const t = tiros[i];
        t.y -= t.speed;

        //SE COLIDIR COM ASTEROIDS SOME O TIRO
        if (t.y + t.altura < 0) {
        tiros.splice(i, 1);
        i--;
        continue;
        }

        for (let j = 0; j < asteroids.length; j++) {
            const a = asteroids[j];
            if (colidiu(t, a)) {
                
                tiros.splice(i, 1);
                asteroids.splice(j, 1);
                i--;
                break;
            }
           
        }

        ctx.fillStyle = "white";
        ctx.fillRect(t.x,t.y,t.largura,t.altura);
                  
    


    }
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.font = "48px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2 - 140, canvas.height / 2);
        trilha.pause(); // pausa a trilha sonora
        return; // não continua o loop

    }
    

    window.requestAnimationFrame(draw);

}

function criarAsteroids(){
    const a = {
    x: Math.random() * canvas.width,
    y: -50,
    velocidade: Math.floor(Math.random() * 3),
    largura: 40,
    altura: 40    

    };

    asteroids.push(a);
}

function atirar() {
    let tiro = {
        x: x + largura/2-2,
        y: y,
        speed: 5, 
        largura: 4,
        altura: 10

    }
    const somTiro = new Audio("/sons/tiro.mp3");  
    somTiro.currentTime = 0;
    somTiro.play();
    tiros.push(tiro)

   
}

function trilhaSonora() {
    if (!trilhaTocando) {
        trilha.loop=true;
        trilha.volume=0.5;
        trilha.currentTime = 0;
        trilha.play();
        trilhaTocando = true;

    }
   

}

nave.onload = function(){
    
    requestAnimationFrame(draw);
    setInterval(criarAsteroids, 1500);

}                                                                                                                                                                       


draw();
