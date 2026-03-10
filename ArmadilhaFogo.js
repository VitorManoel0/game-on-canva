class ArmadilhaFogo {
    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.largura = 32;
        this.altura = 64; // Fogo alto
        
        // Sprite do fogo
        this.fogoImg = new Image();
        this.fogoImg.src = 'assets/fogo.png'; // Coloque sua sprite de fogo aqui
        
        // Animação
        this.frameAtual = 0;
        this.totalFrames = 8; // Ajuste conforme sua sprite
        this.tempoFrame = 100;
        this.ultimoTempo = 0;
        
        // Estados do fogo
        this.ativo = false;
        this.tempoAtivo = 0;
        this.duracaoAtiva = 2000; // Fogo fica ativo por 2 segundos
        this.duracaoInativa = 3000; // Fogo fica inativo por 3 segundos
        this.proximaAtivacao = this.duracaoInativa;
        
        // Visual
        this.alpha = 0; // Opacidade (0 = invisível, 1 = visível)
        this.pulsating = 0;
        
        // Som (opcional)
        this.somFogo = null;
    }
    
    atualizar(deltaTime) {
        this.tempoAtivo += deltaTime;
        this.pulsating += 0.1;
        
        if (this.ativo) {
            // Fogo está ativo
            this.alpha = Math.min(this.alpha + 0.05, 1); // Fade in
            
            if (this.tempoAtivo >= this.duracaoAtiva) {
                // Desativar fogo
                this.ativo = false;
                this.tempoAtivo = 0;
                this.proximaAtivacao = this.duracaoInativa;
            }
            
            // Animar sprite
            this.ultimoTempo += deltaTime;
            if (this.ultimoTempo >= this.tempoFrame) {
                this.frameAtual = (this.frameAtual + 1) % this.totalFrames;
                this.ultimoTempo = 0;
            }
        } else {
            // Fogo está inativo
            this.alpha = Math.max(this.alpha - 0.05, 0); // Fade out
            this.proximaAtivacao -= deltaTime;
            
            if (this.proximaAtivacao <= 0) {
                // Ativar fogo
                this.ativo = true;
                this.tempoAtivo = 0;
                this.frameAtual = 0;
                
                // Tocar som (se tiver)
                if (this.somFogo) {
                    this.somFogo.currentTime = 0;
                    this.somFogo.play();
                }
            }
        }
    }
    
    desenhar(deltaTime) {
        this.atualizar(deltaTime);
        
        if (this.alpha <= 0) return; // Não desenhar se invisível
        
        this.ctx.save();
        this.ctx.globalAlpha = this.alpha;
        
        // Aviso no chão (quando está prestes a ativar)
        if (!this.ativo && this.proximaAtivacao < 1000) {
            // Desenhar círculo vermelho pulsante
            const pulse = Math.sin(this.pulsating) * 0.3 + 0.7;
            this.ctx.fillStyle = `rgba(255, 0, 0, ${pulse * 0.5})`;
            this.ctx.beginPath();
            this.ctx.arc(
                this.x + this.largura / 2,
                this.y + this.altura - 10,
                this.largura / 2,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
            
            // Texto de aviso
            this.ctx.fillStyle = 'yellow';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('!', this.x + this.largura / 2, this.y + this.altura - 5);
        }
        
        // Desenhar fogo (se tiver sprite)
        if (this.ativo && this.fogoImg.complete) {
            const frameX = this.frameAtual * this.largura;
            
            this.ctx.drawImage(
                this.fogoImg,
                frameX, 0,
                this.largura, this.altura,
                this.x, this.y,
                this.largura, this.altura
            );
        } else if (this.ativo) {
            // Desenhar fogo procedural (se não tiver sprite)
            this.desenharFogoProcedural();
        }
        
        this.ctx.restore();
    }
    
    desenharFogoProcedural() {
        // Fogo sem sprite - usando formas geométricas
        const numChamas = 5;
        const pulse = Math.sin(this.pulsating * 2);
        
        for (let i = 0; i < numChamas; i++) {
            const offsetX = (Math.random() - 0.5) * 10;
            const alturaChama = this.altura * (0.6 + Math.random() * 0.4);
            
            // Gradiente de fogo
            const gradiente = this.ctx.createLinearGradient(
                this.x + this.largura / 2,
                this.y + this.altura,
                this.x + this.largura / 2,
                this.y + this.altura - alturaChama
            );
            gradiente.addColorStop(0, '#FF4500'); // Vermelho-laranja
            gradiente.addColorStop(0.5, '#FF8C00'); // Laranja
            gradiente.addColorStop(1, '#FFD700'); // Amarelo
            
            this.ctx.fillStyle = gradiente;
            
            // Desenhar chama (triângulo ondulado)
            this.ctx.beginPath();
            this.ctx.moveTo(this.x + this.largura / 2 + offsetX, this.y + this.altura);
            this.ctx.lineTo(
                this.x + this.largura / 2 + offsetX - 8,
                this.y + this.altura - alturaChama / 2
            );
            this.ctx.quadraticCurveTo(
                this.x + this.largura / 2 + offsetX + pulse * 5,
                this.y + this.altura - alturaChama * 0.8,
                this.x + this.largura / 2 + offsetX,
                this.y + this.altura - alturaChama
            );
            this.ctx.quadraticCurveTo(
                this.x + this.largura / 2 + offsetX - pulse * 5,
                this.y + this.altura - alturaChama * 0.8,
                this.x + this.largura / 2 + offsetX + 8,
                this.y + this.altura - alturaChama / 2
            );
            this.ctx.closePath();
            this.ctx.fill();
        }
        
        // Brilho no centro
        const brilho = this.ctx.createRadialGradient(
            this.x + this.largura / 2,
            this.y + this.altura - 20,
            0,
            this.x + this.largura / 2,
            this.y + this.altura - 20,
            30
        );
        brilho.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        brilho.addColorStop(1, 'rgba(255, 69, 0, 0)');
        this.ctx.fillStyle = brilho;
        this.ctx.fillRect(this.x - 10, this.y + this.altura - 40, this.largura + 20, 40);
    }
    
    verificarColisao(jogador) {
        if (!this.ativo) return false;
        
        // Verificar se jogador está tocando o fogo
        if (jogador.x + jogador.largura > this.x &&
            jogador.x < this.x + this.largura &&
            jogador.y + jogador.altura > this.y &&
            jogador.y < this.y + this.altura) {
            return true; // Jogador morreu!
        }
        
        return false;
    }
    
    // Forçar ativação (útil para testes)
    forcarAtivar() {
        this.ativo = true;
        this.tempoAtivo = 0;
        this.alpha = 1;
    }
    
    // Resetar armadilha
    resetar() {
        this.ativo = false;
        this.tempoAtivo = 0;
        this.alpha = 0;
        this.proximaAtivacao = this.duracaoInativa;
    }
}