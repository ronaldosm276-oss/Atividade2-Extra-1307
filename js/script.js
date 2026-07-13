let tarefas = []
// vamos usar um array para salvar as tarefas, fica mais fácil trabalhar assim

//pegar elementos do DOM

const form = document.querySelector('#addTarefa')
form.addEventListener('submit', (evt) => {

    evt.preventDefault()

    const tarefa = document.querySelector('#tarefa').value
    const responsavel = document.querySelector('#responsavel').value
    const descricao = document.querySelector('#descricao').value
    const data = document.querySelector('#data').value

    
}

)