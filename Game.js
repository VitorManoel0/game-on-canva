function criandoGamePad() {
    function simularTecla(codigo, tipo) {
        const evento = new KeyboardEvent(tipo, {
            key: codigo,
            code: codigo === 'a' ? 'KeyA' : codigo === 'd' ? 'KeyD' : 'Space',
            keyCode: codigo === 'a' ? 65 : codigo === 'd' ? 68 : 32,
            which: codigo === 'a' ? 65 : codigo === 'd' ? 68 : 32,
            bubbles: true
        });
        document.dispatchEvent(evento);
    }

    document.getElementById('btnEsquerda').addEventListener('touchstart', (e) => {
        e.preventDefault();
        simularTecla('a', 'keydown');
    });
    document.getElementById('btnEsquerda').addEventListener('touchend', (e) => {
        e.preventDefault();
        simularTecla('a', 'keyup');
    });

    document.getElementById('btnDireita').addEventListener('touchstart', (e) => {
        e.preventDefault();
        simularTecla('d', 'keydown');
    });
    document.getElementById('btnDireita').addEventListener('touchend', (e) => {
        e.preventDefault();
        simularTecla('d', 'keyup');
    });

    document.getElementById('btnPular').addEventListener('touchstart', (e) => {
        e.preventDefault();
        simularTecla(' ', 'keydown');
    });
    document.getElementById('btnPular').addEventListener('touchend', (e) => {
        e.preventDefault();
        simularTecla(' ', 'keyup');
    });

    document.getElementById('btnEsquerda').addEventListener('mousedown', () => simularTecla('a', 'keydown'));
    document.getElementById('btnEsquerda').addEventListener('mouseup', () => simularTecla('a', 'keyup'));

    document.getElementById('btnDireita').addEventListener('mousedown', () => simularTecla('d', 'keydown'));
    document.getElementById('btnDireita').addEventListener('mouseup', () => simularTecla('d', 'keyup'));

    document.getElementById('btnPular').addEventListener('mousedown', () => simularTecla(' ', 'keydown'));
    document.getElementById('btnPular').addEventListener('mouseup', () => simularTecla(' ', 'keyup'));
}

function carregaSons() {
    const somInteracao = new Audio('assets/brackeys_platformer_assets/sounds/coin.wav');
    somInteracao.volume = 0.1;

    const somPulo = new Audio('assets/brackeys_platformer_assets/sounds/jump.wav');
    somPulo.volume = 0.1;

    const somFase = new Audio('assets/background.mp3');
    somFase.volume = 0.3;

    somFase.loop = true;
    somFase.play();

    return { somInteracao, somPulo };
}

function iniciarFase(fase) {
    personagens = LEVELS[fase].personagens.map(p => {
        const dadosPersonagem = PERSONAGENS[p.categoria][p.nome];
        return new Personagem(ctx, p.x, p.y, dadosPersonagem, p.nome, p.categoria);
    });
    
    mapa_lvl = LEVELS[fase].mapa;
    mapa.carregarFase(mapa_lvl);
}

function desenharPersonagens(deltaTime) {
    personagens.forEach(personagem => {
        personagem.desenhar(deltaTime);
    });
}

function posicaoPadraoJogador() {
    jogador.x = 32;
    jogador.y = 450;
}

function finalizarJogo() {
    function mostrarFimDeJogo() {
        const tela = document.getElementById('telaFimDeJogo');
        tela.classList.remove('hidden');
    }

    mostrarFimDeJogo();

    document.getElementById('btnJogarNovamente').addEventListener('click', () => {
        document.getElementById('telaFimDeJogo').classList.add('hidden');
        location.reload();
    });
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
let personagens = []; 
let mapa_lvl;
let ultimoTempo = 0;
let jogoPausado = false; 

const teclado = {
    cima: false,
    baixo: false,
    esquerda: false,
    direita: false,
    espaco: false,
};

const { somInteracao, somPulo } = carregaSons();
const jogador = new Jogador(ctx, teclado, somPulo);
const mapa = new Mapa(ctx, 32, 32);
let tileset = new Tileset("assets/brackeys_platformer_assets/sprites/world_tileset.png", 16, 16);
let personagensInteragidos = 0;

const dialogSystem = new DialogSystem();

criandoGamePad();

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
const tamanhoJogo = LEVELS.length;

function gameLoop(tempoAtual) {
    let deltaTime = tempoAtual - ultimoTempo;
    ultimoTempo = tempoAtual;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    colorirFundo();
    desenharPersonagens(deltaTime);
    mapa.desenharFase();
    
    // Só atualizar física se NÃO estiver pausado
    if (!jogoPausado) {
        mapa.verificarColisao(jogador);

        if (mapa.verificaFinal(jogador)) {
            if (personagensInteragidos === personagens.length) {
                posicaoPadraoJogador();
                personagensInteragidos = 0;
                proximaFase = faseAtual + 1;
                faseAtual = proximaFase;
                
                if (proximaFase >= tamanhoJogo) {
                    finalizarJogo();
                } else {
                    iniciarFase(proximaFase);
                }
            }
        }

        // Verificar interação com personagens
        personagens.forEach(personagem => {
            if (personagem.interagir(jogador)) {
                personagensInteragidos++;
                somInteracao.currentTime = 0;
                somInteracao.play();
                console.log("entrou");
                
                jogoPausado = true;
            }
        });
    }

    jogador.desenhar(deltaTime);

    // Mostrar contador de personagens interagidos
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.font = "20px ArcadeFont";
    ctx.strokeText("PERSONAGENS: " + personagensInteragidos + "/" + personagens.length, 10, 30);
    ctx.fillText("PERSONAGENS: " + personagensInteragidos + "/" + personagens.length, 10, 30);

    // Mostrar dica de como completar a fase
    if (personagensInteragidos < personagens.length) {
        ctx.fillStyle = "yellow";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.strokeText("Encontre todos os personagens!", canvas.width / 2, 50);
        ctx.fillText("Encontre todos os personagens!", canvas.width / 2, 50);
        ctx.textAlign = "left";
    } else {
        ctx.fillStyle = "#00FF00";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.strokeText("Vá para a saída! →", canvas.width / 2, 50);
        ctx.fillText("Vá para a saída! →", canvas.width / 2, 50);
        ctx.textAlign = "left";
    }

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);