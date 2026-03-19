class Mapa {
    constructor(ctx, larguraTile = 32, alturaTile = 32) {
        this.ctx = ctx;
        this.larguraTile = larguraTile;
        this.alturaTile = alturaTile;
        this.tiles = [];
        this.plataformas = [];
        this.tilesAgua = [];
        this.tipoAgua = 164;
        this.tileset = new Tileset('assets/brackeys_platformer_assets/sprites/world_tileset.png', 16, 16);
    }

    carregarFase(mapa) {
        this.tiles = mapa;
        this.plataformas = [];
        this.tilesAgua = [];

        for (let linha = 0; linha < this.tiles.length; linha++) {
            for (let coluna = 0; coluna < this.tiles[linha].length; coluna++) {
                const tipo = this.tiles[linha][coluna];

                const tileInfo = {
                    x: coluna * this.larguraTile,
                    y: linha * this.alturaTile,
                    largura: this.larguraTile,
                    altura: this.alturaTile,
                    tipo: tipo
                };

                if (tipo === this.tipoAgua) {
                    this.tilesAgua.push(tileInfo);
                    continue;
                }

                if (tipo !== 12 && tipo !== 56) {
                    this.plataformas.push(tileInfo);
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

                if (tipo === this.tipoAgua) {
                    this.desenharAgua(x, y);
                } else {
                    this.tileset.desenharTile(this.ctx, tipo, x, y, 2);
                }
            }

        }
    }

    desenharAgua(x, y) {
        this.ctx.save();

        this.ctx.fillStyle = 'rgba(38, 145, 196, 0.55)';
        this.ctx.fillRect(x, y, this.larguraTile, this.alturaTile);

        this.ctx.fillStyle = 'rgba(190, 240, 255, 0.28)';
        this.ctx.fillRect(x, y, this.larguraTile, Math.max(4, this.alturaTile * 0.22));

        this.ctx.restore();
    }

    verificarAgua(jogador) {
        for (let tileAgua of this.tilesAgua) {
            const encostou =
                jogador.x < tileAgua.x + tileAgua.largura &&
                jogador.x + jogador.largura > tileAgua.x &&
                jogador.y < tileAgua.y + tileAgua.altura &&
                jogador.y + jogador.altura > tileAgua.y;

            if (encostou) {
                return true;
            }
        }

        return false;
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
                if (plataforma.tipo === 87) {
                    const forcaTrampolim = Math.abs(jogador.forcaPulo || 8) * 1.2;
                    jogador.velocidadeY = -forcaTrampolim;
                    jogador.noChao = false;
                } else {
                    jogador.velocidadeY = 0;
                    jogador.noChao = true;
                }
                continue;
            }

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
        const jogadorDireita = jogador.x + jogador.largura;
        const jogadorBaixo = jogador.y + jogador.altura;

        for (let linha = 0; linha < this.tiles.length; linha++) {
            for (let coluna = 0; coluna < this.tiles[linha].length; coluna++) {
                if (this.tiles[linha][coluna] !== 56) continue;

                const tileX = coluna * this.larguraTile;
                const tileY = linha * this.alturaTile;
                const tileDireita = tileX + this.larguraTile;
                const tileBaixo = tileY + this.alturaTile;

                const encostouNoFinal =
                    jogador.x < tileDireita &&
                    jogadorDireita > tileX &&
                    jogador.y < tileBaixo &&
                    jogadorBaixo > tileY;

                if (encostouNoFinal) {
                    return true;
                }
            }
        }

        return false;
    }

    desenhaMoedas(moedas) {

    }
}





