function criandoGamePad() {
    function simularTecla(codigo, tipo) {
        const mapaTecla = {
            'a': { code: 'KeyA', keyCode: 65 },
            'd': { code: 'KeyD', keyCode: 68 },
            ' ': { code: 'Space', keyCode: 32 }
        };

        const tecla = mapaTecla[codigo] || mapaTecla[' '];
        const evento = new KeyboardEvent(tipo, {
            key: codigo,
            code: tecla.code,
            keyCode: tecla.keyCode,
            which: tecla.keyCode,
            bubbles: true
        });
        document.dispatchEvent(evento);
    }

    function bindVirtualButton(buttonId, tecla) {
        const botao = document.getElementById(buttonId);
        if (!botao) return;

        const pressionar = (e) => {
            e.preventDefault();
            simularTecla(tecla, 'keydown');
        };

        const soltar = (e) => {
            e.preventDefault();
            simularTecla(tecla, 'keyup');
        };

        const listenerOptions = { passive: false };

        // Pointer events (unificado para touch, caneta e mouse)
        botao.addEventListener('pointerdown', pressionar, listenerOptions);
        botao.addEventListener('pointerup', soltar, listenerOptions);
        botao.addEventListener('pointercancel', soltar, listenerOptions);
        botao.addEventListener('pointerleave', soltar, listenerOptions);

        // Fallback para navegadores antigos
        botao.addEventListener('touchstart', pressionar, listenerOptions);
        botao.addEventListener('touchend', soltar, listenerOptions);
        botao.addEventListener('mousedown', pressionar, listenerOptions);
        botao.addEventListener('mouseup', soltar, listenerOptions);

        botao.addEventListener('contextmenu', (e) => e.preventDefault(), listenerOptions);
    }

    bindVirtualButton('btnEsquerda', 'a');
    bindVirtualButton('btnDireita', 'd');
    bindVirtualButton('btnPular', ' ');
    bindVirtualButton('btnCima', ' ');
}

function carregaSons() {
    const somInteracao = new Audio('assets/brackeys_platformer_assets/sounds/coin.wav');
    somInteracao.volume = 0.1;

    const somPulo = new Audio('assets/brackeys_platformer_assets/sounds/jump.wav');
    somPulo.volume = 0.1;

    const somFase = new Audio('assets/background.mp3');
    somFase.volume = 0.3;
    somFase.loop = true;

    // Melhorado: com tratamento de erro para mobile/linux
    const playPromise = somFase.play();
    if (playPromise !== undefined) {
        playPromise.catch(err => {
            console.log('Áudio bloqueado. Clique para ativar.');
            // Tocar após primeiro clique
            document.addEventListener('click', function enableAudio() {
                somFase.play();
                document.removeEventListener('click', enableAudio);
            }, { once: true });
        });
    }

    return { somInteracao, somPulo };
}

function iniciarFase(fase) {
    personagens = LEVELS[fase].personagens.map(p => {
        const dadosPersonagem = PERSONAGENS[p.categoria][p.nome];

        let direcao = 1;
        if (p.direcao === -1 || p.direcao === 'esquerda' || p.direcao === 'left') {
            direcao = -1;
        }

        return new Personagem(ctx, p.x, p.y, dadosPersonagem, p.nome, p.categoria, direcao);
    });

    mapa_lvl = LEVELS[fase].mapa;
    mapa.carregarFase(mapa_lvl);

    carregarBackgroundFase(fase);
    configurarFogoFase(fase);

    if (dialogSystem && typeof dialogSystem.aplicarPaleta === 'function') {
        dialogSystem.aplicarPaleta(LEVELS[fase].dialogPalette);
    }
}

function desenharPersonagens(deltaTime) {
    personagens.forEach(personagem => {
        personagem.desenhar(deltaTime);
    });
}

function posicaoPadraoJogador() {
    jogador.x = 32;
    jogador.y = (15 * 32) - jogador.altura; // 448: topo do chão inicial

    if (jogador.xAnterior !== undefined) {
        jogador.xAnterior = jogador.x;
        jogador.yAnterior = jogador.y;
    }

    // Resetar velocidades se existirem
    if (jogador.velocidadeX !== undefined) {
        jogador.velocidadeX = 0;
        jogador.velocidadeY = 0;
    }
}

function reiniciarFaseAtual() {
    personagensInteragidos = 0;
    jogoPausado = false;
    morteNoFogo.ativa = false;
    morteNoFogo.inicioMs = 0;

    teclado.cima = false;
    teclado.baixo = false;
    teclado.esquerda = false;
    teclado.direita = false;
    teclado.espaco = false;

    jogador.sairDaAgua();
    jogador.tempoNaAguaMs = 0;

    posicaoPadraoJogador();
    iniciarFase(faseAtual);
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

function carregarBackgroundFase(fase) {
    const faseConfig = LEVELS[fase] || {};
    const caminhoBackground = faseConfig.background;

    if (!caminhoBackground) {
        backgroundAtual = null;
        return;
    }

    const imagem = new Image();
    imagem.src = caminhoBackground;
    imagem.onload = () => {
        backgroundAtual = imagem;
    };
    imagem.onerror = () => {
        console.warn('Não foi possível carregar background da fase:', caminhoBackground);
        backgroundAtual = null;
    };
}

function colorirFundo() {
    if (backgroundAtual && backgroundAtual.complete) {
        ctx.drawImage(backgroundAtual, 0, 0, canvas.width, canvas.height);
        return;
    }

    // Fallback seguro enquanto a imagem não carrega
    const gradiente = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradiente.addColorStop(0, '#FFB6C1');
    gradiente.addColorStop(0.5, '#FF69B4');
    gradiente.addColorStop(1, '#000000');
    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function configurarFogoFase(fase) {
    const configFogo = LEVELS[fase]?.fireHazard;

    if (!configFogo || !configFogo.enabled) {
        fogoHazard.enabled = false;
        fogoHazard.active = false;
        fogoHazard.zones = [];
        fogoHazard.zoneStates = [];
        return;
    }

    fogoHazard.enabled = true;
    fogoHazard.active = false;
    fogoHazard.intervalMs = configFogo.intervalMs ?? 10000;
    fogoHazard.durationMs = configFogo.durationMs ?? 5000;
    fogoHazard.flameHeight = configFogo.flameHeight ?? 24;
    fogoHazard.pixelSize = configFogo.pixelSize ?? 4;
    fogoHazard.baseIntensity = configFogo.baseIntensity ?? 28;
    fogoHazard.minDecay = configFogo.minDecay ?? 1;
    fogoHazard.maxDecay = configFogo.maxDecay ?? 3;
    fogoHazard.drawThreshold = configFogo.drawThreshold ?? 2;
    fogoHazard.zones = configFogo.zones || [];
    fogoHazard.proximaAtivacao = performance.now() + fogoHazard.intervalMs;
    fogoHazard.desativaEm = 0;

    inicializarDoomFireZones();
}

function atualizarFogoHazard(tempoAtual) {
    if (!fogoHazard.enabled) return;

    if (!fogoHazard.active && tempoAtual >= fogoHazard.proximaAtivacao) {
        fogoHazard.active = true;
        fogoHazard.desativaEm = tempoAtual + fogoHazard.durationMs;

        for (const zoneState of fogoHazard.zoneStates) {
            zoneState.intensidades.fill(0);
        }

        return;
    }

    if (fogoHazard.active && tempoAtual >= fogoHazard.desativaEm) {
        fogoHazard.active = false;
        fogoHazard.proximaAtivacao = tempoAtual + fogoHazard.intervalMs;
    }

    if (fogoHazard.active) {
        atualizarDoomFire();
    }
}

function congelarTimerFogo(deltaTime) {
    if (!fogoHazard.enabled) return;

    fogoHazard.proximaAtivacao += deltaTime;

    if (fogoHazard.active) {
        fogoHazard.desativaEm += deltaTime;
    }
}

function desenharFogoHazard() {
    if (!fogoHazard.enabled || !fogoHazard.active) return;

    for (const zoneState of fogoHazard.zoneStates) {
        const { zone, intensidades, colunas, linhas, pixelSize } = zoneState;
        const topoY = zone.y + zone.height - linhas * pixelSize;

        for (let y = 0; y < linhas; y++) {
            for (let x = 0; x < colunas; x++) {
                const intensidade = intensidades[(y * colunas) + x];
                if (intensidade <= fogoHazard.drawThreshold) continue;

                ctx.fillStyle = fogoHazard.paleta[intensidade];
                ctx.fillRect(
                    zone.x + (x * pixelSize),
                    topoY + (y * pixelSize),
                    pixelSize,
                    pixelSize
                );
            }
        }
    }
}

function inicializarDoomFireZones() {
    fogoHazard.zoneStates = fogoHazard.zones.map(zone => {
        const pixelSize = fogoHazard.pixelSize;
        const alturaVisual = zone.height + fogoHazard.flameHeight;
        const colunas = Math.ceil(zone.width / pixelSize);
        const linhas = Math.ceil(alturaVisual / pixelSize);

        return {
            zone,
            pixelSize,
            colunas,
            linhas,
            intensidades: new Uint8Array(colunas * linhas)
        };
    });
}

function atualizarDoomFire() {
    for (const zoneState of fogoHazard.zoneStates) {
        const { intensidades, colunas, linhas } = zoneState;
        const intensidadeMax = fogoHazard.paleta.length - 1;
        const intensidadeBase = Math.max(0, Math.min(intensidadeMax, fogoHazard.baseIntensity));

        const linhaBase = (linhas - 1) * colunas;
        for (let x = 0; x < colunas; x++) {
            const variacao = Math.floor(Math.random() * 4);
            const falha = Math.random() < 0.08;
            intensidades[linhaBase + x] = falha ? 0 : Math.max(0, intensidadeBase - variacao);
        }

        for (let y = 1; y < linhas; y++) {
            for (let x = 0; x < colunas; x++) {
                const indiceAtual = (y * colunas) + x;
                const intensidadeAtual = intensidades[indiceAtual];
                if (intensidadeAtual === 0) continue;

                const minDecay = Math.max(0, fogoHazard.minDecay);
                const maxDecay = Math.max(minDecay, fogoHazard.maxDecay);
                const perda = minDecay + Math.floor(Math.random() * ((maxDecay - minDecay) + 1));
                const deslocamento = Math.floor(Math.random() * 3) - 1;
                const destinoX = Math.max(0, Math.min(colunas - 1, x + deslocamento));
                const destinoY = y - 1;
                const destinoIndice = (destinoY * colunas) + destinoX;

                intensidades[destinoIndice] = Math.max(intensidadeAtual - perda, 0);
            }
        }
    }
}

function desenharTimerFogo(tempoAtual) {
    if (!fogoHazard.enabled) return;

    const tempoRestanteMs = fogoHazard.active
        ? fogoHazard.desativaEm - tempoAtual
        : fogoHazard.proximaAtivacao - tempoAtual;

    const segundos = (Math.max(0, tempoRestanteMs) / 1000).toFixed(1);
    const texto = fogoHazard.active
        ? `🔥 FOGO ATIVO: ${segundos}s`
        : `🔥 FOGO EM: ${segundos}s`;

    ctx.save();
    ctx.textAlign = 'right';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = fogoHazard.active ? '#FF5A1F' : '#FFD54F';
    ctx.font = '18px ArcadeFont';
    ctx.strokeText(texto, canvas.width - 12, 30);
    ctx.fillText(texto, canvas.width - 12, 30);
    ctx.restore();
}

function jogadorEncostouNoFogo() {
    if (!fogoHazard.enabled || !fogoHazard.active) return false;

    const px = jogador.x;
    const py = jogador.y;
    const pw = jogador.largura;
    const ph = jogador.altura;

    for (const zone of fogoHazard.zones) {
        const alturaContato = Math.max(12, fogoHazard.flameHeight + 8);
        const hitboxFogo = {
            x: zone.x,
            y: zone.y - alturaContato,
            width: zone.width,
            height: alturaContato
        };

        const colidiu =
            px < hitboxFogo.x + hitboxFogo.width &&
            px + pw > hitboxFogo.x &&
            py < hitboxFogo.y + hitboxFogo.height &&
            py + ph > hitboxFogo.y;

        if (colidiu) {
            return true;
        }
    }

    return false;
}

document.getElementById('btnRecarregar').addEventListener('click', () => {
    location.reload();
});

const ctx = canvas.getContext("2d");

let faseAtual = 0;
let personagens = [];
let mapa_lvl;
let jogoPausado = false;
let backgroundAtual = null;
let fogoHazard = {
    enabled: false,
    active: false,
    intervalMs: 10000,
    durationMs: 5000,
    flameHeight: 35,
    pixelSize: 4,
    baseIntensity: 28,
    minDecay: 1,
    maxDecay: 3,
    drawThreshold: 2,
    zones: [],
    zoneStates: [],
    proximaAtivacao: 0,
    desativaEm: 0,
    paleta: [
        'rgba(7, 7, 7, 0)',
        'rgb(31, 7, 7)', 'rgb(47, 15, 7)', 'rgb(71, 15, 7)', 'rgb(87, 23, 7)',
        'rgb(103, 31, 7)', 'rgb(119, 31, 7)', 'rgb(143, 39, 7)', 'rgb(159, 47, 7)',
        'rgb(175, 63, 7)', 'rgb(191, 71, 7)', 'rgb(199, 71, 7)', 'rgb(223, 79, 7)',
        'rgb(223, 87, 7)', 'rgb(223, 87, 7)', 'rgb(215, 95, 7)', 'rgb(215, 95, 7)',
        'rgb(215, 103, 15)', 'rgb(207, 111, 15)', 'rgb(207, 119, 15)', 'rgb(207, 127, 15)',
        'rgb(207, 135, 23)', 'rgb(199, 135, 23)', 'rgb(199, 143, 23)', 'rgb(199, 151, 31)',
        'rgb(191, 159, 31)', 'rgb(191, 159, 31)', 'rgb(191, 167, 39)', 'rgb(191, 167, 39)',
        'rgb(191, 175, 47)', 'rgb(183, 175, 47)', 'rgb(183, 183, 47)', 'rgb(183, 183, 55)',
        'rgb(207, 207, 111)', 'rgb(223, 223, 159)', 'rgb(239, 239, 199)', 'rgb(255, 255, 255)'
    ]
};

// OTIMIZAÇÃO: Sistema de tempo melhorado
let ultimoTempo = 0;
const FPS_ALVO = 60;
const DELTA_TIME_FIXO = 1000 / FPS_ALVO; // ~16.67ms
const MAX_DELTA_TIME = 100; // Limitar saltos grandes

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
const TEMPO_ATE_MORTE_NA_AGUA_MS = 1400;
const ATRASO_REINICIO_FOGO_MS = 1000;
jogador.tempoNaAguaMs = 0;
const morteNoFogo = {
    ativa: false,
    inicioMs: 0
};

const dialogSystem = new DialogSystem();

criandoGamePad();

window.addEventListener('keydown', (e) => {
    if (jogoPausado) return; 

    const key = e.key;
    switch (key) {
        case 'd':
        case 'ArrowRight':
            teclado.direita = true;
            break;
        case 'a':
        case 'ArrowLeft':
            teclado.esquerda = true;
            break;
        case 'w':
        case 'ArrowUp':
            teclado.cima = true;
            break;
        case 's':
        case 'ArrowDown':
            teclado.baixo = true;
            break;
        case ' ':
            e.preventDefault(); 
            teclado.espaco = true;
            break;
    }
});

window.addEventListener('keyup', (e) => {
    const key = e.key;
    switch (key) {
        case 'd':
        case 'ArrowRight':
            teclado.direita = false;
            break;
        case 'a':
        case 'ArrowLeft':
            teclado.esquerda = false;
            break;
        case 'w':
        case 'ArrowUp':
            teclado.cima = false;
            break;
        case 's':
        case 'ArrowDown':
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

    if (deltaTime > MAX_DELTA_TIME) {
        deltaTime = MAX_DELTA_TIME;
    }

    if (deltaTime < 1) {
        requestAnimationFrame(gameLoop);
        return;
    }

    ultimoTempo = tempoAtual;

    if (jogoPausado) {
        congelarTimerFogo(deltaTime);
    } else {
        atualizarFogoHazard(tempoAtual);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    colorirFundo();
    desenharPersonagens(deltaTime);
    mapa.desenharFase();
    desenharFogoHazard();

    if (morteNoFogo.ativa) {
        if ((tempoAtual - morteNoFogo.inicioMs) >= ATRASO_REINICIO_FOGO_MS) {
            reiniciarFaseAtual();
            requestAnimationFrame(gameLoop);
            return;
        }
    }

    if (!jogoPausado && !morteNoFogo.ativa) {
        const estaNaAguaAntes = mapa.verificarAgua(jogador);
        if (estaNaAguaAntes) {
            jogador.entrarNaAgua();
        } else {
            jogador.sairDaAgua();
        }

        jogador.atualizar(deltaTime, DELTA_TIME_FIXO);
        mapa.verificarColisao(jogador);

        const estaNaAguaAgora = mapa.verificarAgua(jogador);
        if (estaNaAguaAgora) {
            jogador.entrarNaAgua();
            jogador.tempoNaAguaMs += deltaTime;

            if (jogador.tempoNaAguaMs >= TEMPO_ATE_MORTE_NA_AGUA_MS) {
                reiniciarFaseAtual();
                requestAnimationFrame(gameLoop);
                return;
            }
        } else {
            jogador.sairDaAgua();
            jogador.tempoNaAguaMs = 0;
        }

        if (jogadorEncostouNoFogo()) {
            morteNoFogo.ativa = true;
            morteNoFogo.inicioMs = tempoAtual;
            jogador.sairDaAgua();
            jogador.tempoNaAguaMs = 0;
            requestAnimationFrame(gameLoop);
            return;
        }

        if (mapa.verificaFinal(jogador)) {
            if (personagensInteragidos === personagens.length) {
                posicaoPadraoJogador();
                personagensInteragidos = 0;
                const proximaFase = faseAtual + 1;
                faseAtual = proximaFase;

                if (proximaFase >= tamanhoJogo) {
                    finalizarJogo();
                } else {
                    iniciarFase(proximaFase);
                }
            }
        }

        personagens.forEach(personagem => {
            if (personagem.interagir(jogador)) {
                personagensInteragidos++;
                somInteracao.currentTime = 0;
                somInteracao.play().catch(() => { }); 
                console.log("Interagiu com personagem!");
                jogoPausado = true;
            }
        });
    }

    if (!morteNoFogo.ativa) {
        jogador.desenhar();
    }

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.font = "20px ArcadeFont";
    ctx.strokeText("PERSONAGENS: " + personagensInteragidos + "/" + personagens.length, 10, 30);
    ctx.fillText("PERSONAGENS: " + personagensInteragidos + "/" + personagens.length, 10, 30);

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

    desenharTimerFogo(tempoAtual);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        ultimoTempo = performance.now();
    }
});