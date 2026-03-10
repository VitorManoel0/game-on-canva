// Dados dos personagens do jogo
const PERSONAGENS = {
    BRUXAS: {
        DOROTHY: {
            assets: 'assets/1 Pink_Monster/Pink_Monster_Idle_4.png',
            assetsZoom: 'assets/1 Pink_Monster/Pink_Monster_Idle_4.png',
            falas: [
                "Olá! Sou Dorothy, a bruxa mais poderosa desta terra!",
                "Minha especialidade é a magia do fogo e do trovão.",
                "Venha treinar comigo se você for corajoso o suficiente!",
                "Cuidado! Meu poder de dano é devastador!",
                "A paciência é uma virtude que eu ainda preciso desenvolver..."
            ],
            atributos: {
                CUR: 3,
                DEB: 5,
                DANO: 9,
                UTI: 6,
                PAC: 4
            }
        },
        RITALIA: {
            assets: 'assets/1 Pink_Monster/Pink_Monster_Idle_4.png',
            assetsZoom: 'assets/1 Pink_Monster/Pink_Monster_Idle_4.png',
            falas: [
                "Ritalia é meu nome! Prazer em conhecê-lo!",
                "Sou especialista em magias de cura e proteção.",
                "Meu objetivo é manter todos seguros e saudáveis.",
                "Às vezes falta-me força ofensiva, mas compensa no suporte!",
                "A utilidade é minha marca registrada!"
            ],
            atributos: {
                CUR: 10,
                DEB: 3,
                DANO: 2,
                UTI: 9,
                PAC: 8
            }
        },
        CIRCY: {
            assets: 'assets/1 Pink_Monster/Pink_Monster_Idle_4.png',
            assetsZoom: 'assets/1 Pink_Monster/Pink_Monster_Idle_4.png',
            falas: [
                "Circy, mestra dos feitiços de controle!",
                "Adoro enfraquecer meus inimigos antes do golpe final.",
                "Minha paciência é infinita... assim como meus debuffs!",
                "Não sou a mais forte, mas deixo todos fracos!"
            ],
            atributos: {
                CUR: 4,
                DEB: 10,
                DANO: 5,
                UTI: 7,
                PAC: 9
            }
        },
        CLAUDIA: {
            assets: 'assets/1 Pink_Monster/Pink_Monster_Idle_4.png',
            assetsZoom: 'assets/1 Pink_Monster/Pink_Monster_Idle_4.png',
            falas: [
                "Claudia, equilibrada em todas as artes!",
                "Não sou a melhor em nada, mas sei fazer de tudo!",
                "A versatilidade é minha maior força.",
                "Posso curar, atacar, proteger... você decide!"
            ],
            atributos: {
                CUR: 6,
                DEB: 6,
                DANO: 6,
                UTI: 7,
                PAC: 7
            }
        },
        AGATHA: {
            assets: 'assets/1 Pink_Monster/Pink_Monster_Idle_4.png',
            assetsZoom: 'assets/1 Pink_Monster/Pink_Monster_Idle_4.png',
            falas: [
                "Agatha, a anciã sábia desta ordem.",
                "Minha utilidade é incomparável após anos de estudo.",
                "Posso não ser forte, mas conheço todos os segredos!",
                "A paciência vem com a idade, jovem aprendiz.",
                "Deixe-me guiá-lo pelo caminho da sabedoria."
            ],
            atributos: {
                CUR: 7,
                DEB: 4,
                DANO: 3,
                UTI: 10,
                PAC: 10
            }
        }
    }
};

// Personagens prontos para usar!
// Acesse diretamente: PERSONAGENS['BRUXAS']['DOROTHY']