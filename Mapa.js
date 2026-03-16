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
            const jogadorX = jogador.x;
            const jogadorY = jogador.y;
            const jogadorXA = jogador.xAnterior ?? jogador.x;
            const jogadorYA = jogador.yAnterior ?? jogador.y;

            const sobrepoeHorizontalmente =
                jogadorX + jogador.largura > plataforma.x &&
                jogadorX < plataforma.x + plataforma.largura;

            const sobrepoeVerticalmente =
                jogadorY + jogador.altura > plataforma.y &&
                jogadorY < plataforma.y + plataforma.altura;

            // Verifica colisão no eixo Y (em cima da plataforma)
            const peAnterior = jogadorYA + jogador.altura;
            const peAtual = jogadorY + jogador.altura;
            const cruzouTopoDaPlataforma = peAnterior <= plataforma.y && peAtual >= plataforma.y;

            if (sobrepoeHorizontalmente &&
                cruzouTopoDaPlataforma &&
                jogador.velocidadeY >= 0) {

                jogador.y = plataforma.y - jogador.altura;
                jogador.velocidadeY = 0;
                jogador.noChao = true;
                continue;
            }

            // Colisão com o teto
            const topoAnterior = jogadorYA;
            const topoAtual = jogadorY;
            const cruzouBaseDaPlataforma =
                topoAnterior >= plataforma.y + plataforma.altura &&
                topoAtual <= plataforma.y + plataforma.altura;

            if (sobrepoeHorizontalmente &&
                cruzouBaseDaPlataforma &&
                jogador.velocidadeY < 0) {

                jogador.y = plataforma.y + plataforma.altura;
                jogador.velocidadeY = 0;
                continue;
            }

            // Colisão lateral esquerda
            if (sobrepoeVerticalmente &&
                jogadorX < plataforma.x + plataforma.largura &&
                jogadorX + jogador.largura > plataforma.x) {

                if (jogadorXA >= plataforma.x + plataforma.largura && jogadorX < plataforma.x + plataforma.largura) {
                    jogador.x = plataforma.x + plataforma.largura;
                    continue;
                }

                // Colisão lateral direita
                if (jogadorXA + jogador.largura <= plataforma.x && jogadorX + jogador.largura > plataforma.x) {
                    jogador.x = plataforma.x - jogador.largura;
                    continue;
                }
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


