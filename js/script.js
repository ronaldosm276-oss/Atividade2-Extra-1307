// ============================================
// VARIÁVEIS GLOBAIS
// ============================================
let tarefas = []       // array que guarda todas as tarefas criadas
let proximoId = 1      // contador usado pra gerar ids únicos

// ============================================
// REFERÊNCIAS DO DOM
// ============================================
const divAberto = document.querySelector('#aberto')
const divAndamento = document.querySelector('#andamento')
const divFinalizado = document.querySelector('#finalizado')
const form = document.querySelector('#addTarefa')
const containerCards = document.querySelector('#cardsTarefa')
const btnLimparTudo = document.querySelector('#btnLimparTudo')

// ============================================
// FUNÇÃO: cria o HTML de UM card, a partir de uma tarefa
// ============================================
const cardsTarefa = (tarefasCards) => {

    const divCard = document.createElement('div')
    if (tarefasCards.prioridade === 'Alta') {
        divCard.setAttribute('class', 'card card-alta')
    } else if (tarefasCards.prioridade === 'Média') {
        divCard.setAttribute('class', 'card card-media')
    } else if (tarefasCards.prioridade === 'Baixa') {
        divCard.setAttribute('class', 'card card-baixa')
    }
    divCard.setAttribute('data-id', tarefasCards.id)

    const h3Titulo = document.createElement('h3')
    h3Titulo.innerHTML = tarefasCards.tarefa

    const h2Responsavel = document.createElement('h2')
    h2Responsavel.innerHTML = `${tarefasCards.responsavel} <br> <br> <span class="${tarefasCards.prioridade}"> - DATA ENTREGA TAREFA ( ${tarefasCards.data} ) - </span> 
    <span id="prioridadeCards" class="${tarefasCards.prioridade}"> ${tarefasCards.prioridade}  <br> </span>`

    const pDescricao = document.createElement('p')
    pDescricao.innerHTML = tarefasCards.descricao

    divCard.appendChild(h3Titulo)
    divCard.appendChild(h2Responsavel)
    divCard.appendChild(pDescricao)

    // Container pra agrupar os botões de mudança de status
    const divAcoes = document.createElement('div')
    divAcoes.setAttribute('class', 'acoes')

    // Decide quais botões criar, conforme o status atual da tarefa
    if (tarefasCards.status === 'aberto') {
        const btnAndamento = document.createElement('button')
        btnAndamento.setAttribute('class', 'btn-andamento')
        btnAndamento.innerHTML = 'Em Andamento'

        const btnFinalizar = document.createElement('button')
        btnFinalizar.setAttribute('class', 'btn-finalizar')
        btnFinalizar.innerHTML = 'Finalizar'

        divAcoes.appendChild(btnAndamento)
        divAcoes.appendChild(btnFinalizar)

    } else if (tarefasCards.status === 'andamento') {
        const btnReabrir = document.createElement('button')
        btnReabrir.setAttribute('class', 'btn-reabrir')
        btnReabrir.innerHTML = 'Reabrir'

        const btnFinalizar = document.createElement('button')
        btnFinalizar.setAttribute('class', 'btn-finalizar')
        btnFinalizar.innerHTML = 'Finalizar'

        divAcoes.appendChild(btnReabrir)
        divAcoes.appendChild(btnFinalizar)

    } else if (tarefasCards.status === 'finalizado') {
        const btnReabrir = document.createElement('button')
        btnReabrir.setAttribute('class', 'btn-reabrir')
        btnReabrir.innerHTML = 'Reabrir'

        const btnAndamento = document.createElement('button')
        btnAndamento.setAttribute('class', 'btn-andamento')
        btnAndamento.innerHTML = 'Em Andamento'

        divAcoes.appendChild(btnReabrir)
        divAcoes.appendChild(btnAndamento)
    }

    // O botão Remover existe em TODOS os status
    const btnRemover = document.createElement('button')
    btnRemover.setAttribute('class', 'btn-remover')
    btnRemover.innerHTML = 'Remover'
    divAcoes.appendChild(btnRemover)

    divCard.appendChild(divAcoes)

    return divCard
}

// ============================================
// FUNÇÃO: redesenha TODOS os cards na tela, do zero
// ============================================
const renderizar = () => {
    divAberto.innerHTML = ''
    divAndamento.innerHTML = ''
    divFinalizado.innerHTML = ''

    tarefas.forEach((t) => {
        const card = cardsTarefa(t)

        if (t.status === 'aberto') {
            divAberto.appendChild(card)
        } else if (t.status === 'andamento') {
            divAndamento.appendChild(card)
        } else if (t.status === 'finalizado') {
            divFinalizado.appendChild(card)
        }
    })
}

// ============================================
// FUNÇÃO: atualiza as contagens por status e por prioridade
// ============================================
const atualizarContagens = () => {

    // Contando por STATUS
    const totalAberto = tarefas.filter(t => t.status === 'aberto').length
    const totalAndamento = tarefas.filter(t => t.status === 'andamento').length
    const totalFinalizado = tarefas.filter(t => t.status === 'finalizado').length

    // Contando por PRIORIDADE
    const totalAlta = tarefas.filter(t => t.prioridade === 'Alta').length
    const totalMedia = tarefas.filter(t => t.prioridade === 'Média').length
    const totalBaixa = tarefas.filter(t => t.prioridade === 'Baixa').length

    // Pegando as sections onde vamos escrever os resultados
    const divProgresso = document.querySelector('#contagemProgresso')
    const divCategoria = document.querySelector('#contagemCategoria')

    divProgresso.innerHTML = `
        <div>Aberto ${totalAberto}</div>
        <div>Em Andamento ${totalAndamento}</div>
        <div>Finalizada ${totalFinalizado}</div>
    `

    divCategoria.innerHTML = `
        <div>Baixa ${totalBaixa}</div>
        <div>Média ${totalMedia}</div>
        <div>Alta ${totalAlta}</div>
    `
}

// ============================================
// EVENTO: envio do formulário (criar nova tarefa)
// ============================================
form.addEventListener('submit', (evt) => {

    evt.preventDefault()

    const tarefa = document.querySelector('#tarefa').value
    const responsavel = document.querySelector('#responsavel').value
    const descricao = document.querySelector('#descricao').value
    const data = document.querySelector('#dataInclusao').value

    const prioridadeSelecionada = document.querySelector('input[name="prioridade"]:checked')

    let prioridadeTexto = ''

    if (prioridadeSelecionada.value === 'A') {
        prioridadeTexto = 'Alta'
    } else if (prioridadeSelecionada.value === 'M') {
        prioridadeTexto = 'Média'
    } else if (prioridadeSelecionada.value === 'B') {
        prioridadeTexto = 'Baixa'
    }

    const novaTarefa = {
        id: proximoId,
        tarefa: tarefa,
        responsavel: responsavel,
        descricao: descricao,
        data: data,
        prioridade: prioridadeTexto,
        status: 'aberto'
    }

    tarefas.push(novaTarefa)
    proximoId++

    form.reset()

    renderizar()
    atualizarContagens()

})

// ============================================
// EVENTO: clique em qualquer botão dentro de um card (delegação de evento)
// ============================================
containerCards.addEventListener('click', (evt) => {

    const cardClicado = evt.target.closest('.card')
    if (!cardClicado) return

    const idTarefa = Number(cardClicado.getAttribute('data-id'))
    const indice = tarefas.findIndex(t => t.id === idTarefa)

    if (evt.target.classList.contains('btn-andamento')) {
        tarefas[indice].status = 'andamento'
    }
    else if (evt.target.classList.contains('btn-finalizar')) {
        tarefas[indice].status = 'finalizado'
    }
    else if (evt.target.classList.contains('btn-reabrir')) {
        tarefas[indice].status = 'aberto'
    }
    else if (evt.target.classList.contains('btn-remover')) {
        tarefas.splice(indice, 1)
    }

    renderizar()
    atualizarContagens()
})



btnLimparTudo.addEventListener('click', () => {
    const confirmou = confirm('Tem certeza que deseja remover todas as tarefas?')

    if (confirmou) {
        tarefas = []          // esvazia o array
        renderizar()          // redesenha (agora sem nenhum card)
        atualizarContagens()  // zera as contagens
    }
})

// ============================================
// FUNÇÃO DEBUG: cria uma tarefa fake rapidamente, pra testes
// ============================================
const criarTarefaDummy = (prioridade) => {
    const novaTarefa = {
        id: proximoId,
        tarefa: `Tarefa Teste ${proximoId}`,
        responsavel: 'Responsável Teste',
        descricao: 'Descrição gerada automaticamente para debug.',
        data: '2026-07-16',
        prioridade: prioridade,
        status: 'aberto'
    }

    tarefas.push(novaTarefa)
    proximoId++

    renderizar()
    atualizarContagens()
}

// Pegando os 3 botões
const btnDummyAlta = document.querySelector('#btnDummyAlta')
const btnDummyMedia = document.querySelector('#btnDummyMedia')
const btnDummyBaixa = document.querySelector('#btnDummyBaixa')

// Cada botão chama a mesma função, só muda o parâmetro
btnDummyAlta.addEventListener('click', () => criarTarefaDummy('Alta'))
btnDummyMedia.addEventListener('click', () => criarTarefaDummy('Média'))
btnDummyBaixa.addEventListener('click', () => criarTarefaDummy('Baixa'))

// ============================================
// INICIALIZAÇÃO — roda uma vez quando a página carrega
// ============================================
renderizar()
atualizarContagens()