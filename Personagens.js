// Dados dos personagens do jogo
const PERSONAGENS = {
    BRUXAS: {
        DOROTHY: {
            assets: 'assets/dorothy.png',
            assetsZoom: 'assets/dorothy_zoom.png',
            falas: [
                "Olá! Sou Dorothy, a bruxa mais poderosa desta terra!",
                "E uma das irmãs fundadoras desse coven",
                "O COVEN DAS SOTURNAS !!!",
                "ja a paciência é uma virtude que eu ainda preciso desenvolver...",
            ],
            atributos: {
                DEBOCHE: 10,
                DANO_MÁGICO: 10,
                PACIÊNCIA: 0,
                UTILIDADE: 8,
                CURA: 3,
            }
        },
        RITALIA: {
            assets: 'assets/ritalia.png',
            assetsZoom: 'assets/ritalia_zoom.png',
            falas: [
                "Ritalia é meu nome! Prazer em conhecê-lo!",
                "Sou a outra irmã fundadora desse coven.",
                "Meu objetivo é manter todes seguros e saudáveis.",
                "E sempre que possível com uma taça de vinho na mão!",
            ],
            atributos: {
                DANO_MÁGICO: 5,
                UTILIDADE: 8,
                GOSTO_POR_VINHO: 10,
                QUEBRAR_A_4º_PAREDE: 10,
                CURA: 10,
            }
        },
    },
    GAYROTAS: {
        NETURNA: {
            assets: 'assets/neturna.png',
            assetsZoom: 'assets/neturna_zoom.png',
            falas: [
                "Olá! Sou Neturna",
                "Sou especialista em magias de água e gelo.",
                "Minha força está na defesa e controle do campo de batalha.",
                "E por hora, é apenas isso que você irá saber sobre mim... o mistério é minha maior arma!",
            ],
            atributos: {
                UTILIDADE: 9,
                TIMIDEZ: 6,
                DANO_MÁGICO: 9,
                MISTERIOSA: 10,
                CURA: 6,
            }
        },
        FLORIELLE: {
            assets: 'assets/florielle.png',
            assetsZoom: 'assets/florielle_zoom.png',
            falas: [
                "Olá! Sou Florielle",
                "Sou especialista em magias de terra e natureza.",
                "Ainda estou me descobrindo, como uma gayrota",
                "Minha força está na cura e suporte para meus aliades.",
            ],
            atributos: {
                QUER_UM_AMOR: 0,
                UTILIDADE: 10,
                DANO_MÁGICO: 8,
                PERFORMATICA: 10,
                CURA: 3,
            }
        },
    },
    DRAGOES: {
        BARBADIOS: {
            assets: 'assets/dragon2.png',
            assetsZoom: 'assets/dragon2_zoom.png',
            falas: [
                "Eu sou Barbadios, o dragão mais feroz que já existiu!",
                "Meu poder é a palavra!",
                "A paciência é algo que eu não tenho... mas quem precisa disso quando se tem poder?"
            ],
            atributos: {
                CUR: 3,
                DEB: 5,
                DANO: 9,
                UTI: 6,
                PAC: 4
            }
        },
        LILLORYS: {

            assets: 'assets/dragon1.png',
            assetsZoom: 'assets/dragon1_zoom.png',
            falas: [
                "Eu sou Lillorys, a Dragonesa mais sábia e poderosa!",
                "Sou a dragoa mais antiga e experiente desta terra, com conhecimento de todas as magias!",
                "sou a progenitora de todos os dragões que existem e que há de existir!",
            ],
            atributos: {
                CUR: 3,
                DEB: 5,
                DANO: 9,
                UTI: 6,
                PAC: 4
            }
        },
    }
};