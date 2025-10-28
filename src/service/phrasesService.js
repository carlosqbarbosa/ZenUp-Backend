const { phrasesData } = require('../data/phrasesData');

function getRandomPhrase(array) {
    const randomValue = Math.floor(Math.random() * array.length);
    return array[randomValue];
}

function getRecommendationPhrase(key, valorMedio) {
    const indicador = valorMedio;
    let phrasekey = key;
    if (key === 'estresse') {
        if (indicador >20) {
            phrasekey += '_alto';
        } else if (indicador <= 10){
            phrasekey += '_normal';
        }
    }
    else if (key === 'humor') {
        if (indicador <10) {
            phrasekey += '_muito_baixo';
        } else if (indicador <= 20){
            phrasekey += '_normal';
        }
    }
        else if (key === 'energia') {
        if (indicador <10) {
            phrasekey += '_muito_baixo';
        } else if (indicador > 20){
            phrasekey += '_alta';
        }
    }
    const frasesDispiniveis = phrasesData[phrasekey];

    if (!frasesDispiniveis || frasesDispiniveis.length === 0) {
        return `Não há frases de recomendação específica para o nível de ${key} (${valorMedio.toFixed(2)}).`;
    }

    return getRandomPhrase(frasesDispiniveis);
}

module.exports = getRecommendationPhrase;