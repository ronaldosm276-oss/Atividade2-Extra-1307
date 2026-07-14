// ============================================
// VARIÁVEIS GLOBAIS (existem durante toda a vida da página)
// ============================================

// ARRAY: uma "lista" ordenada que guarda vários valores.
// Aqui vai guardar um objeto pra cada tarefa criada pelo usuário.
// Começa vazio porque, quando a página abre, ainda não existe nenhuma tarefa.
let tarefas = []

// Variável numérica simples, usada como "gerador de ID único".
// Cada tarefa nova recebe esse número e depois ele é incrementado (+1),
// pra nunca duas tarefas terem o mesmo id.
let proximoId = 1

// ============================================
// REFERÊNCIAS DO DOM (elementos HTML que o JS vai manipular)
// ============================================
// document.querySelector busca UM elemento na página HTML que bate com o seletor.
// Aqui usamos '#id' porque cada um desses elementos tem um id único no HTML.
// Guardamos essas referências em variáveis fora de qualquer função,
// pra que TODAS as funções do arquivo consigam usá-las (isso se chama "escopo global").

const divAberto = document.querySelector('#aberto')       // coluna de tarefas "Aberto"
const divAndamento = document.querySelector('#andamento') // coluna de tarefas "Em Andamento"
const divFinalizado = document.querySelector('#finalizado') // coluna de tarefas "Finalizado"
const form = document.querySelector('#addTarefa')         // o formulário inteiro

// ============================================
// EVENTO DE SUBMIT DO FORMULÁRIO
// ============================================
// addEventListener "escuta" uma ação do usuário (nesse caso, 'submit' = enviar o form).
// A função de dentro só roda QUANDO essa ação acontece (usuário clica em "Adicionar Tarefa").
// "evt" é o objeto do evento — carrega informações sobre o que aconteceu.

form.addEventListener('submit', (evt) => {

    // Por padrão, enviar um form recarrega a página (comportamento nativo do navegador).
    // preventDefault() cancela isso, pra podermos controlar tudo via JS sem recarregar.
    evt.preventDefault()

    // .value pega o texto que o usuário digitou em cada input.
    // Cada linha abaixo busca o elemento e já extrai o valor dele, guardando numa constante.
    const tarefa = document.querySelector('#tarefa').value
    const responsavel = document.querySelector('#responsavel').value
    const descricao = document.querySelector('#descricao').value
    const data = document.querySelector('#dataInclusao').value

    // Os 3 radios de prioridade têm o mesmo "name", então formam um grupo.
    // O seletor ':checked' busca, dentro desse grupo, qual está marcado.
    // .value pega o valor dele ("A", "M" ou "B").
    const prioridadeSelecionada = document.querySelector('input[name="prioridade"]:checked')

    // OBJETO: uma estrutura de dados com pares "chave: valor".
    // Aqui juntamos tudo que foi digitado num único "pacote" que representa UMA tarefa.
    const novaTarefa = {
        id: proximoId,                      // identificador único dessa tarefa
        tarefa: tarefa,                     // nome da tarefa
        responsavel: responsavel,           // quem é responsável
        descricao: descricao,               // descrição da tarefa
        data: data,                         // data de realização
        prioridade: prioridadeSelecionada.value, // "A", "M" ou "B"
        status: 'aberto'                    // toda tarefa nova começa como "aberto" (regra do roteiro)
    }

    // .push() é um MÉTODO DE ARRAY que adiciona um item no FINAL do array.
    // Aqui, adicionamos o objeto novaTarefa dentro do array tarefas.
    tarefas.push(novaTarefa)

    // Incrementa o contador, pra próxima tarefa criada ter um id diferente (2, depois 3, etc.)
    proximoId++

    // Limpa todos os campos do formulário de uma vez (inputs e radios voltam ao estado inicial).
    form.reset()

    // Chama a função renderizar(), que vai redesenhar os cards na tela
    // com base no array tarefas atualizado (que agora tem uma tarefa a mais).
    renderizar()
})

// ============================================
// FUNÇÃO: cria o HTML de UM card, a partir de uma tarefa
// ============================================
// Essa função é uma "fábrica de cards": você entrega uma tarefa (objeto),
// ela devolve um elemento <div> pronto, mas ainda "solto" (não colocado na tela).
// Quem decide onde colocar esse card é a função renderizar(), mais abaixo.

const cardsTarefa = (tarefasCards) => {

    // createElement cria um elemento HTML NOVO, ainda fora da página (só na memória).
    const divCard = document.createElement('div')

    // setAttribute define um atributo HTML no elemento criado.
    // Aqui damos a classe 'card' (útil pro CSS depois) e um atributo customizado 'data-id',
    // que guarda o id da tarefa DENTRO do próprio elemento HTML.
    // Isso é o que vai permitir, depois, descobrir "qual tarefa é essa" quando o usuário
    // clicar num botão dentro do card (usando data-id pra achar a tarefa certa no array).
    divCard.setAttribute('class', 'card')
    divCard.setAttribute('data-id', tarefasCards.id)

    // Criando cada parte do conteúdo do card, conforme o roteiro pede as tags certas:
    // h3 pro título, h2 pro responsável (e depois data/prioridade), p pra descrição.

    const h3Titulo = document.createElement('h3')
    h3Titulo.innerHTML = tarefasCards.tarefa // acessando a propriedade "tarefa" do objeto

    const h2Responsavel = document.createElement('h2')
    h2Responsavel.innerHTML = tarefasCards.responsavel

    const pDescricao = document.createElement('p')
    pDescricao.innerHTML = tarefasCards.descricao

    // appendChild "encaixa" um elemento DENTRO de outro, na estrutura da página.
    // Aqui estamos montando o card como uma "caixinha" contendo título, responsável e descrição.
    divCard.appendChild(h3Titulo)
    divCard.appendChild(h2Responsavel)
    divCard.appendChild(pDescricao)

    // return devolve o card pronto pra quem chamou essa função.
    // Repara que esse card ainda NÃO foi colocado em nenhuma div da página —
    // isso é proposital: essa função só "fabrica", quem "instala" é outra função.
    return divCard
}

// ============================================
// FUNÇÃO: redesenha TODOS os cards na tela, do zero
// ============================================
// Essa função é chamada sempre que algo muda no array tarefas
// (uma tarefa nova, uma tarefa que mudou de status, uma tarefa removida, etc.)
// Ela sempre limpa tudo e desenha de novo, garantindo que a tela
// nunca fique "desatualizada" em relação ao array.

const renderizar = () => {

    // innerHTML = '' apaga todo o conteúdo HTML de dentro do elemento.
    // Fazemos isso nas 3 colunas antes de redesenhar, pra não duplicar cards
    // toda vez que renderizar() for chamada de novo.
    divAberto.innerHTML = ''
    divAndamento.innerHTML = ''
    divFinalizado.innerHTML = ''

    // forEach é um MÉTODO DE ARRAY que executa uma função para CADA item do array,
    // um de cada vez, na ordem em que estão guardados.
    // "t" é o "apelido" que demos pra tarefa da vez dentro desse loop
    // (na 1ª rodada é a tarefas[0], na 2ª é tarefas[1], e assim por diante).
    tarefas.forEach((t) => {

        // Chamamos a "fábrica de cards", passando a tarefa da vez.
        // O card pronto (mas ainda solto) fica guardado na constante "card".
        const card = cardsTarefa(t)

        // Aqui decidimos em qual coluna esse card específico deve entrar,
        // olhando a propriedade "status" da tarefa.
        // appendChild efetivamente coloca o card dentro da div escolhida,
        // fazendo ele aparecer na tela.
        if (t.status === 'aberto') {
            divAberto.appendChild(card)
        } else if (t.status === 'andamento') {
            divAndamento.appendChild(card)
        } else if (t.status === 'finalizado') {
            divFinalizado.appendChild(card)
        }
    })
}