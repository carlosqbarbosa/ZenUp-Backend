const dashboardService = require("../service/dashboardService");
const getRecommendationPhrase = require("../service/phrasesService");

exports.getIndicadoresAgregados = async (req, res) => {
  const id_empresa_param = req.params.id;
  try {
    const indicadores = await dashboardService.getIndicadoresAgregados(id_empresa_param);

    if (indicadores.totalCheckins === 0) {
      return res.status(200).json({
        message: "Nenhum dado de check-in disponível para esta empresa.",
        indicadores: indicadores,
      });
    }

    const frases = {
      humor: getRecommendationPhrase("humor", indicadores.humorMedio),
      estresse: getRecommendationPhrase("estresse", indicadores.estresseMedio),
      energia: getRecommendationPhrase("energia", indicadores.energiaMedia),
    };
    res.status(200).json({
      message: "Indicadores agregados gerados com sucesso.",
      indicadores: indicadores,
      frases: frases,
    });
  } catch (error) {
        console.error('Erro ao gerar indicadores agregados:', error.message);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.getUsuariosPorEmpresa = async (req, res) => {
  const id_empresa_param = req.params.id;
  try {
    const usuarios = await dashboardService.getUsuariosPorEmpresa(id_empresa_param);
    res.status(200).json({
      message: "Lista de usuários obtida com sucesso.",
      usuarios: usuarios,
    });
  } catch (error) {
    console.error("Erro ao buscar usuários por empresa:", error.message);
    res.status(500).json({ message: "Erro interno do servidor." });
  };
};