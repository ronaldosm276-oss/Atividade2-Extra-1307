let tarefas = []
// vamos usar um array para salvar as tarefas, fica mais fácil trabalhar assim

let proximoId = 1
//pegar elementos do DOM

const form = document.querySelector('#addTarefa')
form.addEventListener('submit', (evt) => {

    evt.preventDefault()

    const tarefa = document.querySelector('#tarefa').value
    const responsavel = document.querySelector('#responsavel').value
    const descricao = document.querySelector('#descricao').value
    const data = document.querySelector('#dataInclusao').value

    const prioridadeSelecionada = document.querySelector('input[name="prioridade"]:checked')


    console.log(prioridadeSelecionada.value) // isso aqui é "A", "M" ou "B"

    

    // Montando o objeto da nova tarefa
    const novaTarefa = {
        id: proximoId,
        tarefa: tarefa,
        responsavel: responsavel,
        descricao: descricao,
        data: data,
        prioridade: prioridadeSelecionada.value,
        status: 'aberto' // toda tarefa nova nasce como "aberto", conforme o roteiro
    }

    // Guardando no array
    tarefas.push(novaTarefa)

    // Incrementando o contador pra próxima tarefa ter um id diferente
    proximoId++

    console.log(tarefas) // só pra você conferir se tá empilhando certo

    tarefa = ''
})

