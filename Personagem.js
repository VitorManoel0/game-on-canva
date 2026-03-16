class Personagem {
    constructor(ctx, x, y, dados, nome, categoria) {
        this.ctx = ctx;
        this.personagemImg = new Image();
        this.personagemImg.src = dados.assets;
        this.larguraTile = 32; // Aumentado para personagens
        this.alturaTile = 32;
        this.x = x;
        this.y = y;
        this.dados = dados; // Dados completos do personagem (falas, atributos, etc)
        this.nome = nome;
        this.categoria = categoria;

        // Configuração da animação
        this.frameAtual = 0;
        this.totalFrames = 4; // Ajuste conforme seu sprite
        this.tempoFrame = 200;
        this.ultimoTempo = 0;
        this.escala = 1;
        this.show = true;
        this.interagido = false;

        // Efeito visual de disponibilidade
        this.pulseOffset = 0;
        this.pulseSpeed = 0.05;
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

        // Atualizar efeito de pulse
        this.pulseOffset += this.pulseSpeed;
    }

    desenhar(deltaTime) {
        if (!this.show) return;
        this.atualizarFrame(deltaTime);
        
        this.ctx.save();

        // Desenhar indicador de interação (círculo pulsante)
        if (!this.interagido) {
            const pulseSize = Math.sin(this.pulseOffset) * 3;
            this.ctx.strokeStyle = '#FFD700';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(
                this.x + (this.larguraTile * this.escala) / 2,
                this.y + (this.alturaTile * this.escala) / 2,
                (this.larguraTile * this.escala) / 2 + 5 + pulseSize,
                0,
                Math.PI * 2
            );
            this.ctx.stroke();

            // Texto "Pressione E" ou ícone
            this.ctx.fillStyle = 'white';
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 3;
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.strokeText('💬', this.x + (this.larguraTile * this.escala) / 2, this.y - 10);
            this.ctx.fillText('💬', this.x + (this.larguraTile * this.escala) / 2, this.y - 10);
        }

        // Desenhar o personagem
        const frameX = (this.frameAtual % this.totalFrames) * this.larguraTile;
        const frameY = Math.floor(this.frameAtual / this.totalFrames) * this.alturaTile;

        this.ctx.drawImage(
            this.personagemImg,
            frameX, frameY,
            this.larguraTile, this.alturaTile,
            this.x, this.y,
            this.larguraTile * this.escala,
            this.alturaTile * this.escala
        );

        // Se já interagiu, mostrar check mark
        if (this.interagido) {
            this.ctx.fillStyle = '#00FF00';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 3;
            this.ctx.strokeText('✓', this.x + (this.larguraTile * this.escala) / 2, this.y - 5);
            this.ctx.fillText('✓', this.x + (this.larguraTile * this.escala) / 2, this.y - 5);
        }

        this.ctx.restore();
    }

    interagir(jogador) {
        if (this.show &&
            jogador.x < this.x + (this.larguraTile * this.escala) &&
            jogador.x + jogador.largura > this.x &&
            jogador.y < this.y + (this.alturaTile * this.escala) &&
            jogador.y + jogador.altura > this.y) {
            
            if (!this.interagido) {
                this.interagido = true;
                
                // Abrir diálogo do personagem (verificar se dialogSystem existe)
                if (typeof dialogSystem !== 'undefined' && dialogSystem) {
                    dialogSystem.mostrarDialog(this.dados, this.nome);
                }
                
                return true;
            }
        }
        return false;
    }

    foiInteragido() {
        return this.interagido;
    }

    resetar() {
        this.interagido = false;
    }
}