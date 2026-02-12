function carregaSons() {
    const somMoeda = new Audio('assets/brackeys_platformer_assets/sounds/coin.wav');
    somMoeda.volume = 0.1;

    const somPulo = new Audio('assets/brackeys_platformer_assets/sounds/jump.wav');
    somPulo.volume = 0.1;

    // const somFase = new Audio('assets/background.mp3');
    // somFase.volume = 0.3;

    // somFase.loop = true;
    // somFase.play();

    return { somMoeda, somPulo };
}

function iniciarFase(fase) {
    moedas = LEVELS[fase].moedas.map(m => new Moeda(ctx, m.x, m.y, somMoeda));
    mapa_lvl = LEVELS[fase].mapa
    mapa.carregarFase(mapa_lvl);
}

function desenharMoedas(deltaTime) {
    moedas.forEach(moeda => {
        moeda.desenhar(deltaTime);
    });
}

function posicaoPadraoJogador() {
    jogador.x = 32;
    jogador.y = 450;
}

function colorirFundo() {
    let gradiente = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradiente.addColorStop(0, '#FFB6C1');
    gradiente.addColorStop(0.5, '#FF69B4');
    gradiente.addColorStop(1, '#000000');
    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

document.getElementById('btnRecarregar').addEventListener('click', () => {
    location.reload();
});

let canvas = document.getElementById("desenho1");
let ctx = canvas.getContext("2d");
let faseAtual = 0;
let moedas = [];
let mapa_lvl;
let ultimoTempo = 0
const teclado = {
    cima: false,
    baixo: false,
    esquerda: false,
    direita: false,
    espaco: false,
};
const { somMoeda, somPulo } = carregaSons()
const jogador = new Jogador(ctx, teclado, somPulo);
const mapa = new Mapa(ctx, 32, 32);
let tileset = new Tileset("assets/brackeys_platformer_assets/sprites/world_tileset.png", 16, 16);
let moedasColetadas = 0

window.addEventListener('keydown', (e) => {
    const key = e.key;
    switch (key) {
        case 'd':
            teclado.direita = true;
            break;
        case 'a':
            teclado.esquerda = true;
            break;
        case 'w':
            teclado.cima = true;
            break;
        case 's':
            teclado.baixo = true;
            break;
        case ' ':
            teclado.espaco = true;
            break;
    }
});

window.addEventListener('keyup', (e) => {
    const key = e.key;
    switch (key) {
        case 'd':
            teclado.direita = false;
            break;
        case 'a':
            teclado.esquerda = false;
            break;
        case 'w':
            teclado.cima = false;
            break;
        case 's':
            teclado.baixo = false;
            break;
        case ' ':
            teclado.espaco = false;
            break;
    }
});

posicaoPadraoJogador();
iniciarFase(faseAtual);
console.log(moedas);

function gameLoop(tempoAtual) {
    let deltaTime = tempoAtual - ultimoTempo;
    ultimoTempo = tempoAtual;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    colorirFundo();
    desenharMoedas(deltaTime);
    mapa.desenharFase();
    mapa.verificarColisao(jogador);

    if (mapa.verificaFinal(jogador)) {
        if (moedasColetadas === moedas.length) {
            posicaoPadraoJogador();
            moedasColetadas = 0;
            proximaFase = faseAtual + 1;
            faseAtual = proximaFase
            iniciarFase(proximaFase);
        }
    }

    jogador.desenhar(deltaTime);

    moedas.forEach(moeda => {
        if (moeda.coletar(jogador)) {
            moedasColetadas++;
        }
    });


    ctx.fillStyle = "black"; // Cor do texto
    ctx.font = "20px ArcadeFont"; // Fonte (opcional)
    ctx.fillText("MOEDAS:" + moedasColetadas, 10, 30);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);