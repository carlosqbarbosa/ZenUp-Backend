const { phrasesData } = require('../data/phrasesData');

function getRandomPhrase(array) {
    const randomValue = Math.floor(Math.random() * array.length);
    return array[randomValue];
}

function getRecommendationPhrase(key, valorMedio) {
    const indicador = valorMedio;
    let phrasekey = key;
    if (key === 'estresse') {
        if (indicador <= 2) {
            phrasekey += '_baixo';
        } else if (indicador >= 4 ){
            phrasekey += '_alto';
        } else {
            phrasekey += '_normal';
        }
    }
    else if (key === 'humor') {
        if (indicador <= 2) {
            phrasekey += '_muito_baixo';
        } else if (indicador >=5){
            phrasekey += '_alto';
        } else if (indicador > 2 && indicador < 5) {
            phrasekey += '_normal';
        }
    }
        else if (key === 'energia') {
        if (indicador <= 2) {
            phrasekey += '_muito_baixo';
        } else if (indicador >= 4){
            phrasekey += '_alta';
        } else {
            phrasekey += '_normal';
        }
    }
    const frasesDispiniveis = phrasesData[phrasekey];

    if (!frasesDispiniveis || frasesDispiniveis.length === 0) {
        return `Não há frases de recomendação específica para o nível de ${key} (${valorMedio.toFixed(2)}).`;
    }

    return getRandomPhrase(frasesDispiniveis);
}

module.exports = getRecommendationPhrase;