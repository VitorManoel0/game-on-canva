class DialogSystem {
    constructor() {
        this.dialogoAtivo = false;
        this.personagemAtual = null;
        this.falaAtual = 0;
        this.overlayElement = null;
        console.log('DialogSystem criado!');
    }

    // Criar elementos DOM apenas quando necessário
    inicializar() {
        if (this.overlayElement) {
            console.log('DialogSystem já inicializado');
            return;
        }
        
        console.log('Inicializando DialogSystem...');
        
        const overlay = document.createElement('div');
        overlay.id = 'dialogOverlay';
        overlay.className = 'dialog-overlay hidden';

        overlay.innerHTML = `
            <div class="dialog-container">
                <button class="dialog-close" id="btnFecharDialog">✖</button>
                
                <div class="dialog-content">
                    <div class="dialog-left">
                        <div class="personagem-frame">
                            <img id="personagemImagem" src="" alt="Personagem">
                        </div>
                        <h2 id="personagemNome" class="personagem-nome">Nome</h2>
                    </div>
                    
                    <div class="dialog-right">
                        <div class="dialog-fala-container">
                            <div class="balao-fala">
                                <p id="textoFala" class="texto-fala"></p>
                            </div>
                            <div class="dialog-controls">
                                <button id="btnAnterior" class="btn-nav">⬅ Anterior</button>
                                <span id="indicadorFala" class="indicador-fala">1/1</span>
                                <button id="btnProximo" class="btn-nav">Próximo ➡</button>
                            </div>
                        </div>
                        
                        <div class="atributos-container">
                            <h3 class="atributos-titulo">Atributos</h3>
                            <canvas id="radarChart" width="250" height="250"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertBefore(overlay, document.body.firstChild);
        this.overlayElement = overlay;

        // Adicionar event listeners
        document.getElementById('btnFecharDialog').addEventListener('click', () => {
            console.log('Fechando diálogo via botão');
            this.fecharDialog();
        });
        document.getElementById('btnProximo').addEventListener('click', () => this.proximaFala());
        document.getElementById('btnAnterior').addEventListener('click', () => this.falaAnterior());

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                console.log('Fechando diálogo via overlay');
                this.fecharDialog();
            }
        });
        
        console.log('DialogSystem inicializado com sucesso!');
    }

    mostrarDialog(personagem, nome) {
        console.log('=== ABRINDO DIÁLOGO ===');
        console.log('Personagem:', nome);
        console.log('Dados:', personagem);
        
        // Inicializar se ainda não foi
        if (!this.overlayElement) {
            console.log('Primeira vez - inicializando elementos DOM...');
            this.inicializar();
        }

        // Verificar se personagem tem dados válidos
        if (!personagem) {
            console.error('ERRO: Dados do personagem são null/undefined!');
            return;
        }
        
        if (!personagem.falas || !personagem.atributos) {
            console.error('ERRO: Personagem sem falas ou atributos!', personagem);
            return;
        }

        this.personagemAtual = personagem;
        this.falaAtual = 0;
        this.dialogoAtivo = true;

        console.log('Atualizando UI...');
        
        // Atualizar imagem e nome
        const imgElement = document.getElementById('personagemImagem');
        const nomeElement = document.getElementById('personagemNome');
        
        if (imgElement && nomeElement) {
            imgElement.src = personagem.assetsZoom || personagem.assets;
            nomeElement.textContent = nome;
            console.log('Imagem e nome atualizados');
        } else {
            console.error('ERRO: Elementos de imagem ou nome não encontrados!');
        }

        // Mostrar primeira fala
        this.atualizarFala();

        // Desenhar atributos
        this.desenharRadarChart(personagem.atributos);

        // Mostrar overlay
        this.overlayElement.classList.remove('hidden');
        console.log('Diálogo aberto!');
    }

    atualizarFala() {
        const falas = this.personagemAtual.falas;
        const textoElement = document.getElementById('textoFala');
        const indicador = document.getElementById('indicadorFala');
        const btnAnterior = document.getElementById('btnAnterior');
        const btnProximo = document.getElementById('btnProximo');

        console.log('Atualizando fala:', this.falaAtual, '/', falas.length);

        if (falas.length === 0) {
            textoElement.textContent = "Este personagem não tem falas ainda.";
            btnAnterior.disabled = true;
            btnProximo.disabled = true;
            indicador.textContent = "0/0";
            return;
        }

        // Atualizar texto
        textoElement.textContent = falas[this.falaAtual];
        console.log('Fala atual:', falas[this.falaAtual]);

        // Atualizar indicador
        indicador.textContent = `${this.falaAtual + 1}/${falas.length}`;

        // Atualizar botões
        btnAnterior.disabled = this.falaAtual === 0;
        btnProximo.disabled = this.falaAtual === falas.length - 1;
    }

    proximaFala() {
        if (this.falaAtual < this.personagemAtual.falas.length - 1) {
            this.falaAtual++;
            console.log('Próxima fala:', this.falaAtual);
            this.atualizarFala();
        }
    }

    falaAnterior() {
        if (this.falaAtual > 0) {
            this.falaAtual--;
            console.log('Fala anterior:', this.falaAtual);
            this.atualizarFala();
        }
    }

    fecharDialog() {
        console.log('Fechando diálogo');
        this.dialogoAtivo = false;
        if (this.overlayElement) {
            this.overlayElement.classList.add('hidden');
        }
        
        if (typeof jogoPausado !== 'undefined') {
            jogoPausado = false;
            console.log('Jogo despausado!');
        }
    }

    desenharRadarChart(atributos) {
        console.log('Desenhando radar chart com atributos:', atributos);
        
        const canvas = document.getElementById('radarChart');
        if (!canvas) {
            console.error('Canvas do radar chart não encontrado!');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const raio = 90;

        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Definir atributos
        const labels = Object.keys(atributos);
        const valores = Object.values(atributos);
        const numLados = labels.length;
        const anguloStep = (Math.PI * 2) / numLados;

        console.log('Atributos:', labels, valores);

        // Desenhar linhas de fundo (grades)
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;

        for (let nivel = 1; nivel <= 5; nivel++) {
            ctx.beginPath();
            for (let i = 0; i <= numLados; i++) {
                const angulo = i * anguloStep - Math.PI / 2;
                const raioAtual = (raio / 5) * nivel;
                const x = centerX + Math.cos(angulo) * raioAtual;
                const y = centerY + Math.sin(angulo) * raioAtual;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.stroke();
        }

        // Desenhar linhas dos eixos
        ctx.strokeStyle = '#999';
        for (let i = 0; i < numLados; i++) {
            const angulo = i * anguloStep - Math.PI / 2;
            const x = centerX + Math.cos(angulo) * raio;
            const y = centerY + Math.sin(angulo) * raio;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        // Desenhar labels
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < numLados; i++) {
            const angulo = i * anguloStep - Math.PI / 2;
            const x = centerX + Math.cos(angulo) * (raio + 25);
            const y = centerY + Math.sin(angulo) * (raio + 25);

            ctx.fillText(labels[i].toUpperCase(), x, y);
        }

        // Desenhar área de atributos (preenchida)
        ctx.beginPath();
        for (let i = 0; i <= numLados; i++) {
            const idx = i % numLados;
            const angulo = i * anguloStep - Math.PI / 2;
            const valor = valores[idx] / 10; // Assumindo valores de 0-10
            const raioValor = raio * valor;
            const x = centerX + Math.cos(angulo) * raioValor;
            const y = centerY + Math.sin(angulo) * raioValor;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();

        // Preencher com cor rosa semi-transparente
        ctx.fillStyle = 'rgba(255, 105, 180, 0.4)';
        ctx.fill();

        // Contorno rosa mais escuro
        ctx.strokeStyle = '#FF69B4';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Desenhar pontos nos vértices
        ctx.fillStyle = '#FF1493';
        for (let i = 0; i < numLados; i++) {
            const angulo = i * anguloStep - Math.PI / 2;
            const valor = valores[i] / 10;
            const raioValor = raio * valor;
            const x = centerX + Math.cos(angulo) * raioValor;
            const y = centerY + Math.sin(angulo) * raioValor;

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        
        console.log('Radar chart desenhado!');
    }
}