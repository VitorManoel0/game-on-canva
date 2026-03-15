sprites = {
    idle: 'assets/1 Pink_Monster/Pink_Monster_Idle_4.png',
    direita: 'assets/1 Pink_Monster/Pink_Monster_Run_6.png',
    pulo: 'assets/1 Pink_Monster/Pink_Monster_Jump_8.png'
}

class Jogador {
    constructor(ctx, teclado, som) {
        this.largura = 32;
        this.altura = 32;
        this.ctx = ctx;
        this.teclado = teclado;
        this.x = 0;
        this.y = 0;
        this.velocidade = 3;
        this.deltaBase = 1000 / 60; // Base de 60 FPS para normalização

        // Configuração da animação
        this.frameAtual = 0;
        this.totalFrames = 4;
        this.tempoFrame = 150;
        this.ultimoTempo = 0;

        // Direção do sprite
        this.direcao = 1;

        // Física do pulo
        this.velocidadeY = 0;
        this.gravidade = 0.4;
        this.forcaPulo = -8;
        this.noChao = false;
        this.alturaChao = ctx.canvas.height - this.altura; // Posição do chão

        this.jogador = new Image();
        this.jogador.src = sprites.idle;
        this.som = som;
    }

    pular() {
        if (this.noChao) {
            this.velocidadeY = this.forcaPulo;
            this.noChao = false;
            this.som.currentTime = 0;
            this.som.play();
        }
    }

    aplicarGravidade() {
        this.velocidadeY += this.gravidade * this.deltaScale;
        this.y += this.velocidadeY * this.deltaScale;

        if (this.y >= this.alturaChao) {
            this.y = this.alturaChao;
            this.velocidadeY = 0;
            this.noChao = true;
        }
    }

    movimentacao() {
        if (this.teclado.direita) {
            if (this.x < this.ctx.canvas.width - this.largura)
                this.x += this.velocidade * this.deltaScale;
        }
        if (this.teclado.esquerda) {
            if (this.x > 0)
                this.x -= this.velocidade * this.deltaScale;
        }
        if (this.teclado.cima || this.teclado.espaco) {
            this.pular();
        }

        // Limites após normalização por delta
        if (this.x < 0) this.x = 0;
        const limiteDireito = this.ctx.canvas.width - this.largura;
        if (this.x > limiteDireito) this.x = limiteDireito;
    }

    atualizarFrame(deltaTime, deltaReferencia = this.deltaBase) {
        if (jogoPausado) return; // Não atualizar se o jogo estiver pausado

        this.deltaScale = Math.max(0.5, Math.min(2, deltaTime / deltaReferencia));
        this.movimentacao();
        this.mudaSprite();
        this.aplicarGravidade();

        // Atualiza a animação
        this.ultimoTempo += deltaTime;

        if (this.ultimoTempo >= this.tempoFrame) {
            this.frameAtual++;
            if (this.frameAtual >= this.totalFrames) {
                this.frameAtual = 0;
            }
            this.ultimoTempo = 0;
        }
    }

    mudaSprite() {
        if (!this.noChao) {
            if (this.jogador.src !== sprites.pulo) {
                this.jogador.src = sprites.pulo;
                this.totalFrames = 7;
                if (this.teclado.esquerda) {
                    this.direcao = -1;
                }
                if (this.teclado.direita) {
                    this.direcao = 1;
                }
            }
        }
        else if (this.teclado.direita) {
            if (this.jogador.src !== sprites.direita) {
                this.direcao = 1;
                this.jogador.src = sprites.direita;
                this.totalFrames = 6;
            }
            this.direcao = 1;
        }
        else if (this.teclado.esquerda) {
            if (this.jogador.src !== sprites.direita) {
                this.jogador.src = sprites.direita;
                this.totalFrames = 6;
            }
            this.direcao = -1;
        }
        else {
            if (this.jogador.src !== sprites.idle) {
                this.jogador.src = sprites.idle;
                this.totalFrames = 4;
            }
        }
    }

    desenhar(deltaTime, deltaReferencia) {
        this.atualizarFrame(deltaTime, deltaReferencia);

        this.ctx.save();

        let posIniX = this.largura * this.frameAtual;

        if (this.direcao === -1) {
            // Espelha horizontalmente
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(
                this.jogador,
                posIniX, 0,
                this.largura, this.altura,
                -this.x - this.largura, this.y, // Inverte a posição X
                this.largura, this.altura
            );
        } else {

            this.ctx.drawImage(
                this.jogador,
                posIniX, 0,                 // posição no sprite sheet
                this.largura, this.altura, // tamanho do recorte
                this.x, this.y,            // posição no canvas
                this.largura, this.altura  // tamanho de exibição
            );
        }
        this.ctx.restore();
    }
}