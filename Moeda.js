class Moeda {
    constructor(ctx, x, y, som) {
        this.ctx = ctx;
        this.moeda = new Image();
        this.moeda.src = "assets/brackeys_platformer_assets/sprites/coin.png";
        this.larguraTile = 16;
        this.alturaTile = 16;
        this.tilesporLinha = 0;
        this.x = x;
        this.y = y;

        // Configuração da animação
        this.frameAtual = 0;
        this.totalFrames = 12;
        this.tempoFrame = 150;
        this.ultimoTempo = 0;
        this.escala = 1.5;
        this.show = true;
        this.som = som

    }

    atualizarFrame(deltaTime) {
        this.ultimoTempo += deltaTime;

        if (this.ultimoTempo >= this.tempoFrame) {
            this.frameAtual++;
            if (this.frameAtual >= this.totalFrames) {
                this.frameAtual = 0;
            }
            this.ultimoTempo = 0;
        }
    }

    desenhar(deltaTime) {
        if (!this.show) return;
        this.atualizarFrame(deltaTime);
        this.ctx.save();
        const frameX = (this.frameAtual % this.totalFrames) * this.larguraTile;
        const frameY = Math.floor(this.frameAtual / this.totalFrames) * this.alturaTile;

        // Desenha o frame atual
        this.ctx.drawImage(
            this.moeda,
            frameX, frameY,                          // Posição no spritesheet
            this.larguraTile, this.alturaTile,       // Tamanho do recorte
            this.x, this.y,                                     // Posição no canvas
            this.larguraTile * this.escala,          // Largura renderizada
            this.alturaTile * this.escala            // Altura renderizada
        );

        this.ctx.restore();
    }

    coletar(jogador) {
        if (this.show &&
            jogador.x < this.x + (this.larguraTile) &&
            jogador.x + jogador.largura > this.x &&
            jogador.y < this.y + (this.alturaTile) &&
            jogador.y + jogador.altura > this.y) {

            this.show = false;
            this.som.currentTime = 0;
            this.som.play();
            return true;
        }
        return false;
    }

    coletada() {
        return !this.show;
    }
}