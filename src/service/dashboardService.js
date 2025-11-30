const { PrismaClient } = require("@prisma/client");
const { phrasesData } = require("../data/phrasesData");
const prisma = new PrismaClient();

const dashboardService = {
 
  async getIndicadoresAgregados(id_empresa_param) {
    try {
      const id_empresa = parseInt(id_empresa_param);
      const respostas = await prisma.Respostas.findMany({
        where: {
          usuarios: {  
            empresas: {  
              id_empresa: id_empresa
            }
          }
        },
        select: {
          humor: true,
          energia: true,
          estresse: true,
          data_resposta: true
        }
      });
      
      if (respostas.length === 0) {
        return {
          humor_medio: 0,
          energia_media: 0,
          estresse_medio: 0,
          total_respostas: 0,
          periodo: 'sem_dados'
        };
      }
      
      const humor_medio = respostas.reduce((acc, r) => acc + r.humor, 0) / respostas.length;
      const energia_media = respostas.reduce((acc, r) => acc + r.energia, 0) / respostas.length;
      const estresse_medio = respostas.reduce((acc, r) => acc + r.estresse, 0) / respostas.length;
      
      const resultado = {
        humor_medio: Math.round(humor_medio * 100) / 100,
        energia_media: Math.round(energia_media * 100) / 100,
        estresse_medio: Math.round(estresse_medio * 100) / 100,
        total_respostas: respostas.length,
        periodo: 'todos'
      };
    
      
      return resultado;
      
    } catch (error) {
      throw error;
    }
  },

  async getUsuariosPorEmpresa(id_empresa_param) {
    try {
      const id_empresa = parseInt(id_empresa_param);    
      const usuarios = await prisma.Usuarios.findMany({
        where: {
          id_empresa: id_empresa,
          ativo: true
        },
        select: {
          id_usuario: true,
          nome_funcionario: true,
          email: true,
          tipo_usuario: true,
          ativo: true,
          id_equipe: true,
          equipes: {
            select: {
              id_equipe: true,
              nome_equipe: true
            }
          }
        },
        orderBy: {
          nome_funcionario: 'asc'
        }
      });
      
      return usuarios;
      
    } catch (error) {
      console.error("Erro ao buscar usuários:", error.message);
      throw error;
    }
  },

  async getDailyMetrics(id_empresa_param) {
    try {
      const id_empresa = parseInt(id_empresa_param);
      const seteDiasAtras = new Date();
      seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
      
      const respostas = await prisma.Respostas.findMany({
        where: {
          usuarios: {
            empresas: {
              id_empresa: id_empresa
            }
          },
          data_resposta: {
            gte: seteDiasAtras
          }
        },
        select: {
          humor: true,
          id_usuario: true
        }
      });
      
      const usuariosUnicos = new Set(respostas.map(r => r.id_usuario)).size;
      const totalCheckins = respostas.length;
      const humorMedio = respostas.length > 0
        ? respostas.reduce((acc, r) => acc + r.humor, 0) / respostas.length
        : 0;
      
      const totalUsuarios = await prisma.Usuarios.count({
        where: {
          id_empresa: id_empresa,
          ativo: true
        }
      });
      
      const participacao = totalUsuarios > 0
        ? Math.round((usuariosUnicos / totalUsuarios) * 100)
        : 0;
      
      const metricas = [
        {
          nome: "Check-ins",
          valor: totalCheckins,
          descricao: "Últimos 7 dias",
          cor: "#4335A7"
        },
        {
          nome: "Humor médio",
          valor: humorMedio.toFixed(1),
          descricao: "Escala de 1 a 5",
          cor: "#FF6B35"
        },
        {
          nome: "Participação",
          valor: participacao,
          descricao: `${usuariosUnicos} de ${totalUsuarios} usuários`,
          cor: "#00B894"
        }
      ];
      
      return metricas;
      
    } catch (error) {
      console.error("Erro ao buscar métricas diárias:", error.message);
      throw error;
    }
  },

  async getCheckinsDiarios(id_empresa_param) {
    try {
      const id_empresa = parseInt(id_empresa_param);
      
      const trintaDiasAtras = new Date();
      trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
      
      const checkins = await prisma.Respostas.findMany({
        where: {
          usuarios: {
            empresas: {
              id_empresa: id_empresa
            }
          },
          data_resposta: {
            gte: trintaDiasAtras
          }
        },
        select: {
          data_resposta: true,
          id_usuario: true
        }
      });
      
      const checkinsPorDia = {};
      
      checkins.forEach(checkin => {
        const data = checkin.data_resposta.toISOString().split('T')[0];
        checkinsPorDia[data] = (checkinsPorDia[data] || 0) + 1;
      });
      
      return Object.entries(checkinsPorDia).map(([data, total]) => ({
        data,
        total_checkins: total
      }));
      
    } catch (error) {
      console.error("Erro ao buscar check-ins diários:", error.message);
      throw error;
    }
  },

  async getCheckinsComparison(id_empresa_param) {
  try {
    const id_empresa = parseInt(id_empresa_param);
    const dozeMesesAtras = new Date();
    dozeMesesAtras.setMonth(dozeMesesAtras.getMonth() - 12);
 
    const totalUsuarios = await prisma.Usuarios.count({
      where: {
        id_empresa: id_empresa,
        ativo: true
      }
    });
 
    const respostas = await prisma.Respostas.findMany({
      where: {
        usuarios: {
          empresas: {
            id_empresa: id_empresa
          }
        },
        data_resposta: {
          gte: dozeMesesAtras
        }
      },
      select: {
        data_resposta: true,
        id_usuario: true,
        humor: true
      },
      orderBy: {
        data_resposta: 'asc'
      }
    });
    
    const dadosPorMes = {};
    
    respostas.forEach(resposta => {
      const data = new Date(resposta.data_resposta);
      const mesAno = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-01`;
      
      if (!dadosPorMes[mesAno]) {
        dadosPorMes[mesAno] = {
          data: mesAno,
          usuarios_unicos: new Set(),
          total_checkins: 0,
          humores: []
        };
      }
      
      dadosPorMes[mesAno].usuarios_unicos.add(resposta.id_usuario);
      dadosPorMes[mesAno].total_checkins++;
      dadosPorMes[mesAno].humores.push(resposta.humor);
    });

    const resultado = [];
    const dataAtual = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const data = new Date(dataAtual);
      data.setMonth(data.getMonth() - i);
      
      const mesAno = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-01`;
      
      if (dadosPorMes[mesAno]) {
        const mes = dadosPorMes[mesAno];
        resultado.push({
          data: mesAno,
          checkins: mes.usuarios_unicos.size,
          usuarios: totalUsuarios,
          humor: mes.humores.length > 0 
            ? parseFloat((mes.humores.reduce((a, b) => a + b, 0) / mes.humores.length).toFixed(1))
            : 0,
          total_checkins: mes.total_checkins
        });
      } else {
        resultado.push({
          data: mesAno,
          checkins: 0,
          usuarios: totalUsuarios,
          humor: 0,
          total_checkins: 0
        });
      }
    }
    
    return resultado;
    
  } catch (error) {
    throw error;
  }
},

  async getMoodMetrics(id_empresa_param) {
  try {
    const id_empresa = parseInt(id_empresa_param);
    
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
    
    const respostas = await prisma.Respostas.findMany({
      where: {
        usuarios: {
          empresas: {
            id_empresa: id_empresa
          }
        },
        data_resposta: {
          gte: seteDiasAtras
        }
      },
      select: {
        humor: true,
        energia: true,
        estresse: true
      }
    });
    
    if (respostas.length === 0) {
      return {
        humor_medio: 0,
        energia_media: 0,
        estresse_medio: 0,
        total: 0,
        distribuicao_humor: {
          muito_baixo: 0,
          baixo: 0,
          medio: 0,
          alto: 0,
          muito_alto: 0
        },
        distribuicao_energia: {
          muito_baixa: 0,
          baixa: 0,
          media: 0,
          alta: 0,
          muito_alta: 0
        },
        distribuicao_estresse: {
          muito_baixo: 0,
          baixo: 0,
          medio: 0,
          alto: 0,
          muito_alto: 0
        }
      };
    }
    
    // Calcular médias
    const humor_medio = respostas.reduce((acc, r) => acc + r.humor, 0) / respostas.length;
    const energia_media = respostas.reduce((acc, r) => acc + r.energia, 0) / respostas.length;
    const estresse_medio = respostas.reduce((acc, r) => acc + r.estresse, 0) / respostas.length;
    
    // Calcular distribuições
    const resultado = {
      humor_medio: parseFloat(humor_medio.toFixed(2)),
      energia_media: parseFloat(energia_media.toFixed(2)),
      estresse_medio: parseFloat(estresse_medio.toFixed(2)),
      total: respostas.length,
      
      // Distribuição de humor
      distribuicao_humor: {
        muito_baixo: respostas.filter(r => r.humor === 1).length,
        baixo: respostas.filter(r => r.humor === 2).length,
        medio: respostas.filter(r => r.humor === 3).length,
        alto: respostas.filter(r => r.humor === 4).length,
        muito_alto: respostas.filter(r => r.humor === 5).length
      },
      
      // Distribuição de energia
      distribuicao_energia: {
        muito_baixa: respostas.filter(r => r.energia === 1).length,
        baixa: respostas.filter(r => r.energia === 2).length,
        media: respostas.filter(r => r.energia === 3).length,
        alta: respostas.filter(r => r.energia === 4).length,
        muito_alta: respostas.filter(r => r.energia === 5).length
      },
      
      // Distribuição de estresse
      distribuicao_estresse: {
        muito_baixo: respostas.filter(r => r.estresse === 1).length,
        baixo: respostas.filter(r => r.estresse === 2).length,
        medio: respostas.filter(r => r.estresse === 3).length,
        alto: respostas.filter(r => r.estresse === 4).length,
        muito_alto: respostas.filter(r => r.estresse === 5).length
      }
    };
    
    return resultado;
    
  } catch (error) {
    console.error("Erro ao buscar métricas de humor:", error.message);
    throw error;
  }
},

  async getSuggestions(id_empresa_param) {
    try {
      const id_empresa = parseInt(id_empresa_param);
    
      const indicadores = await this.getIndicadoresAgregados(id_empresa);
      const sugestoes = [];
      
      const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
      
      // Análise de humor
      if (indicadores.humor_medio < 2.5) {
        sugestoes.push({ 
          text: getRandom(phrasesData.humor_muito_baixo), 
          type: "warning" 
        });
      } else if (indicadores.humor_medio >= 4) {
        sugestoes.push({ 
          text: getRandom(phrasesData.humor_alto), 
          type: "success" 
        });
      } else {
        sugestoes.push({ 
          text: getRandom(phrasesData.humor_normal), 
          type: "success" 
        });
      }
      
      // Análise de estresse
      if (indicadores.estresse_medio >= 3.5) {
        sugestoes.push({ 
          text: getRandom(phrasesData.estresse_alto), 
          type: "error" 
        });
      } else {
        sugestoes.push({ 
          text: getRandom(phrasesData.estresse_normal), 
          type: "success" 
        });
      }
      
      // Análise de energia
      if (indicadores.energia_media < 2.5) {
        sugestoes.push({ 
          text: getRandom(phrasesData.energia_baixa), 
          type: "warning" 
        });
      } else if (indicadores.energia_media >= 4) {
        sugestoes.push({ 
          text: getRandom(phrasesData.energia_alta), 
          type: "success" 
        });
      } else {
        sugestoes.push({ 
          text: getRandom(phrasesData.energia_normal), 
          type: "success" 
        });
      }
      
      return sugestoes;
      
    } catch (error) {
      console.error("Erro ao gerar sugestões:", error.message);
      throw error;
    }
  }
};

module.exports = dashboardService;