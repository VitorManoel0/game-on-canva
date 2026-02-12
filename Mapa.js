class Mapa {
    constructor(ctx, larguraTile = 32, alturaTile = 32) {
        this.ctx = ctx;
        this.larguraTile = larguraTile;
        this.alturaTile = alturaTile;
        this.tiles = [];
        this.plataformas = [];
        this.tileset = new Tileset('assets/brackeys_platformer_assets/sprites/world_tileset.png', 16, 16);
    }

    carregarFase(mapa) {
        this.tiles = mapa;
        this.plataformas = [];

        for (let linha = 0; linha < this.tiles.length; linha++) {
            for (let coluna = 0; coluna < this.tiles[linha].length; coluna++) {
                const tipo = this.tiles[linha][coluna];

                if (tipo !== 12 && tipo !== 56) {
                    this.plataformas.push({
                        x: coluna * this.larguraTile,
                        y: linha * this.alturaTile,
                        largura: this.larguraTile,
                        altura: this.alturaTile,
                        tipo: tipo
                    });
                }
            }
        }
    }

    desenharFase() {
        for (let linha = 0; linha < this.tiles.length; linha++) {
            for (let coluna = 0; coluna < this.tiles[linha].length; coluna++) {
                const tipo = this.tiles[linha][coluna];
                const x = coluna * this.larguraTile;
                const y = linha * this.alturaTile;

                this.tileset.desenharTile(ctx, tipo, x, y, 2);
            }

        }
    }


    verificarColisao(jogador) {
        jogador.noChao = false;

        for (let plataforma of this.plataformas) {
            // Verifica colisão no eixo Y (em cima da plataforma)
            if (jogador.x + jogador.largura > plataforma.x &&
                jogador.x < plataforma.x + plataforma.largura &&
                jogador.y + jogador.altura > plataforma.y &&
                jogador.y + jogador.altura <= plataforma.y + 10 &&
                jogador.velocidadeY >= 0) {

                jogador.y = plataforma.y - jogador.altura;
                jogador.velocidadeY = 0;
                jogador.noChao = true;
            }

            // Colisão com o teto
            if (jogador.x + jogador.largura > plataforma.x &&
                jogador.x < plataforma.x + plataforma.largura &&
                jogador.y < plataforma.y + plataforma.altura &&
                jogador.y >= plataforma.y + plataforma.altura - 10 &&
                jogador.velocidadeY < 0) {

                jogador.y = plataforma.y + plataforma.altura;
                jogador.velocidadeY = 0;
            }

            // Colisão lateral esquerda
            if (jogador.x < plataforma.x + plataforma.largura &&
                jogador.x + jogador.largura > plataforma.x &&
                jogador.y + jogador.altura > plataforma.y + 5 &&
                jogador.y < plataforma.y + plataforma.altura - 5) {

                if (jogador.x > plataforma.x) {
                    jogador.x = plataforma.x + plataforma.largura;
                }
            }

            // Colisão lateral direita
            if (jogador.x + jogador.largura > plataforma.x &&
                jogador.x < plataforma.x &&
                jogador.y + jogador.altura > plataforma.y + 5 &&
                jogador.y < plataforma.y + plataforma.altura - 5) {

                jogador.x = plataforma.x - jogador.largura;
            }
        }
    }

    verificaFinal(jogador) {
        const x = Math.trunc(jogador.x / this.larguraTile);
        const y = Math.trunc(jogador.y / this.alturaTile)
        if (this.tiles[y][x] === 56) {
            return true;
        }
        return false;
    }

    desenhaMoedas(moedas) {

    }
}

