const dashboardService = require('../service/dashboardService');

const dashboardController = {
  async getIndicadoresAgregados(req, res) {
    try {
      const { id } = req.params;
      const indicadores = await dashboardService.getIndicadoresAgregados(id);
      
      res.status(200).json(indicadores);
      
    } catch (error) {
      console.error('Erro no controller de indicadores:', error.message);
      res.status(500).json({ 
        erro: 'Erro ao buscar indicadores',
        mensagem: error.message 
      });
    }
  },

  async getUsuariosPorEmpresa(req, res) {
    try {
      const { id } = req.params;

      
      const usuarios = await dashboardService.getUsuariosPorEmpresa(id);
      
      res.status(200).json(usuarios);
      
    } catch (error) {
      console.error('Erro no controller de usuários:', error.message);
      res.status(500).json({ 
        erro: 'Erro ao buscar usuários',
        mensagem: error.message 
      });
    }
  },

  async getDailyMetrics(req, res) {
    try {
      const { id } = req.params; 
      const metricas = await dashboardService.getDailyMetrics(id);
      
      res.status(200).json(metricas);
      
    } catch (error) {
      console.error('Erro no controller de métricas diárias:', error.message);
      res.status(500).json({ 
        erro: 'Erro ao buscar métricas diárias',
        mensagem: error.message 
      });
    }
  },

  async getCheckinsDiarios(req, res) {
    try {
      const { id } = req.params;  
      const checkins = await dashboardService.getCheckinsDiarios(id);
      
      res.status(200).json(checkins);
      
    } catch (error) {
      console.error('Erro no controller de check-ins:', error.message);
      res.status(500).json({ 
        erro: 'Erro ao buscar check-ins',
        mensagem: error.message 
      });
    }
  },

  async getDailyMetricsDetailed(req, res) {
    try {
      const { id_empresa } = req.params;
      
      const metricas = await dashboardService.getDailyMetrics(id_empresa);
      
      res.status(200).json(metricas);
      
    } catch (error) {
      console.error('Erro ao buscar métricas detalhadas:', error.message);
      res.status(500).json({ 
        erro: 'Erro ao buscar métricas',
        mensagem: error.message 
      });
    }
  },

  async getCheckinsComparison(req, res) {
    try {
      const { id_empresa } = req.params;
      const comparacao = await dashboardService.getCheckinsComparison(id_empresa);
      
      res.status(200).json(comparacao);
      
    } catch (error) {
      console.error('Erro ao buscar comparação de check-ins:', error.message);
      res.status(500).json({ 
        erro: 'Erro ao buscar comparação',
        mensagem: error.message 
      });
    }
  },

  async getMoodMetrics(req, res) {
    try {
      const { id_empresa } = req.params;
      
      const mood = await dashboardService.getMoodMetrics(id_empresa);
      
      res.status(200).json(mood);
      
    } catch (error) {
      console.error('Erro ao buscar métricas de humor:', error.message);
      res.status(500).json({ 
        erro: 'Erro ao buscar métricas de humor',
        mensagem: error.message 
      });
    }
  },
  async getSuggestions(req, res) {
  try {
    const { id_empresa } = req.params; 
    const sugestoes = await dashboardService.getSuggestions(id_empresa);
    
    res.status(200).json(sugestoes);
    
  } catch (error) {
    console.error('Erro ao buscar sugestões:', error.message);
    res.status(500).json({ 
      erro: 'Erro ao buscar sugestões',
      mensagem: error.message 
    });
  }
}
};

module.exports = dashboardController;