const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt'); // Necessário para criar a senha hash

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
    console.log('Iniciando o seeding de dados...');

// 1. Limpar dados existentes (Ordem: Filhos para Pais)

// [1º] Tabelas Mais Dependentes (Respostas, Conversa_IA, Dicas)
await prisma.respostas.deleteMany();
await prisma.conversa_IA.deleteMany(); // Tabela que depende de Usuarios/Questionarios
await prisma.dicas.deleteMany();       // Tabela que depende de Questionarios

// [2º] Tabelas de Relacionamento (Usuarios, Questionarios)
await prisma.usuarios.deleteMany();
await prisma.questionarios.deleteMany();

// [3º] Tabelas de Entidade Principal (Equipes)
await prisma.equipes.deleteMany(); // Deve vir depois de Usuarios e Questionarios

// [4º] Tabelas de Infraestrutura (Empresas, Condicao)
await prisma.empresas.deleteMany();
await prisma.condicao.deleteMany();

// ... (restante do código para criar dados)
    
    // (Nota: Adicione Questionarios e Dicas se necessário)

    // 2. Criar Condição (Necessário para Equipes)
    const condicao = await prisma.condicao.create({
        data: {
            nome_condicao: 'Bem-Estar Inicial',
            descricao: 'Condição inicial para todas as equipes.',
            range_condicao: 100,
        },
    });

    // 3. Criar Empresa de Teste
    const empresa = await prisma.empresas.create({
        data: {
            nome_empresa: 'ZenCorp Teste',
            cnpj: '12.345.678/0001-90',
            dominio_email: 'zencorp.com',
            plano: 'Premium',
        },
    });

    // 4. Criar Equipe (Relacionada à Empresa)
    const equipe = await prisma.equipes.create({
        data: {
            nome_equipe: 'Alpha Team',
            descricao: 'Equipe de desenvolvimento backend.',
            id_empresa: empresa.id_empresa,
            id_condicao: condicao.id_condicao,
        },
    });

    // 5. Criar Usuários de Teste (Gestor e Colaborador)
    const senhaHash = await bcrypt.hash('123456', SALT_ROUNDS); // Senha simples para testes

    // Usuário GESTOR (com acesso ao dashboard)
    const gestor = await prisma.usuarios.create({
        data: {
            nome_funcionario: 'Lider Gestor',
            email: 'gestor@zencorp.com',
            senha_hash: senhaHash,
            tipo_usuario: 'gestor',
            id_empresa: empresa.id_empresa,
            id_equipe: equipe.id_equipe,
        },
    });

    // Usuário COLABORADOR (apenas faz check-in)
    const colaborador = await prisma.usuarios.create({
        data: {
            nome_funcionario: 'Alice Colaboradora',
            email: 'alice@zencorp.com',
            senha_hash: senhaHash,
            tipo_usuario: 'colaborador',
            id_empresa: empresa.id_empresa,
            id_equipe: equipe.id_equipe,
        },
    });

    // 6. Criar Questionário de Teste (Necessário para Respostas)
    const questionario = await prisma.questionarios.create({
        data: {
            id_equipe: equipe.id_equipe,
        }
    });

    // 7. Criar Respostas (Check-ins) para o Dashboard
    await prisma.respostas.createMany({
        data: [
            { id_usuario: colaborador.id_usuario, id_questionario: questionario.id_questionario, humor: 5, energia: 4, estresse: 1, data_resposta: new Date('2025-10-01T10:00:00Z') }, // Bom
            { id_usuario: colaborador.id_usuario, id_questionario: questionario.id_questionario, humor: 1, energia: 2, estresse: 5, data_resposta: new Date('2025-10-02T10:00:00Z') }, // Ruim
            { id_usuario: colaborador.id_usuario, id_questionario: questionario.id_questionario, humor: 3, energia: 3, estresse: 3, data_resposta: new Date('2025-10-03T10:00:00Z') }, // Médio
        ],
    });

    console.log('Seeding concluído com sucesso!');
    console.log(`Gestor: ${gestor.email} | Colaborador: ${colaborador.email}`);

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });