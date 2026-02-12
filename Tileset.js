class Tileset {
    constructor(imagemSrc, larguraTile, alturaTile) {
        this.imagem = new Image();
        this.imagem.src = imagemSrc;
        this.larguraTile = larguraTile;
        this.alturaTile = alturaTile;
        this.tilesporLinha = 0; 
        
        this.imagem.addEventListener('load', () => {
            this.tilesporLinha = Math.floor(this.imagem.width / this.larguraTile);
        });
    }
    
    desenharTile(ctx, indiceTile, x, y, escala = 1) {
        let coluna = indiceTile % this.tilesporLinha;
        let linha = Math.floor(indiceTile / this.tilesporLinha);
        
        let sx = coluna * this.larguraTile;
        let sy = linha * this.alturaTile;
        
        ctx.drawImage(
            this.imagem,
            sx, sy,                           // Posição no tileset
            this.larguraTile, this.alturaTile, // Tamanho do tile
            x, y,                             // Posição no canvas
            this.larguraTile * escala,        // Largura escalada
            this.alturaTile * escala          // Altura escalada
        );
    }
    
    desenharTilePorPosicao(ctx, linha, coluna, x, y, escala = 1) {
        let sx = coluna * this.larguraTile;
        let sy = linha * this.alturaTile;
        
        ctx.drawImage(
            this.imagem,
            sx, sy,
            this.larguraTile, this.alturaTile,
            x, y,
            this.larguraTile * escala,
            this.alturaTile * escala
        );
    }
}