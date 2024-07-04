// comunidade
document.addEventListener("DOMContentLoaded", function () {
    const comentarioForm = document.getElementById('comentario-form');
    comentarioForm.addEventListener('submit', function (e) {
        e.preventDefault();
        adicionarComentario();
    });

    function adicionarComentario() {
        const nome = document.getElementById('nome').value;
        const comentario = document.getElementById('comentario').value;
        const corUser = '#' + Math.floor(Math.random() * 16777215).toString(16);

        localStorage.setItem('cor' + nome, corUser);

        const comentarioItem = criarElemento('div', null, 'comentario-item');
        const comentarioNome = criarElemento('p', nome);
        comentarioNome.style.color = corUser;
        const comentarioTexto = criarElemento('p', comentario);

        const respostaButton = criarElemento('button', 'Responder');
        respostaButton.addEventListener('click', function () {
            const respostaForm = criarFormularioResposta(comentarioItem);
            comentarioItem.appendChild(respostaForm);
            respostaForm.style.display = 'block';
        });

        comentarioItem.appendChild(comentarioNome);
        comentarioItem.appendChild(comentarioTexto);
        comentarioItem.appendChild(respostaButton);

        document.getElementById('lista-comentarios').appendChild(comentarioItem);
        document.getElementById('comentario-form').reset();

        const comentarios = JSON.parse(localStorage.getItem('comentarios')) || [];
        comentarios.push({ nome, comentario });
        localStorage.setItem('comentarios', JSON.stringify(comentarios));
    }

    function carregarComentarios() {
        const comentarios = JSON.parse(localStorage.getItem('comentarios')) || [];
        comentarios.forEach(function (comentario) {
            const comentarioItem = criarElemento('div', null, 'comentario-item');
            const comentarioNome = criarElemento('p', `Nome: ${comentario.nome}`);
            comentarioNome.style.color = localStorage.getItem(`cor${comentario.nome}`);
            const comentarioTexto = criarElemento('p', `Comentário: ${comentario.comentario}`);
            comentarioItem.appendChild(comentarioNome);
            comentarioItem.appendChild(comentarioTexto);

            const respostaButton = criarElemento('button', 'Responder');
            respostaButton.addEventListener('click', function () {
                const respostaForm = criarFormularioResposta(comentarioItem);
                comentarioItem.appendChild(respostaForm);
                respostaForm.style.display = 'block';
            });

            comentarioItem.appendChild(respostaButton);
            document.getElementById('lista-comentarios').appendChild(comentarioItem);

            carregarRespostas(comentarioItem, comentario.nome);
        });
    }

    function carregarRespostas(parentItem, comentarioNome) {
        const respostas = JSON.parse(localStorage.getItem('respostas')) || [];
        const respostaItem = respostas.find(function (item) {
            return item.nome === comentarioNome;
        });

        if (respostaItem) {
            respostaItem.resposta.forEach(function (resposta) {
                const respostaItemDiv = criarElemento('div', null, 'resposta-item');
                const respostaNomeP = criarElemento('p', `Resposta de ${resposta.nome}:`);
                respostaNomeP.style.color = localStorage.getItem(`cor${resposta.nome}`);
                const respostaTexto = criarElemento('p', resposta.texto);

                respostaItemDiv.appendChild(respostaNomeP);
                respostaItemDiv.appendChild(respostaTexto);

                parentItem.appendChild(respostaItemDiv);
            });
        }
    }

    function criarElemento(tipo, texto, classe) {
        const elemento = document.createElement(tipo);
        if (texto) elemento.textContent = texto;
        if (classe) elemento.classList.add(classe);
        return elemento;
    }

    function criarFormularioResposta(parentItem) {
        const respostaForm = criarElemento('form', null, 'resposta-form');
        respostaForm.innerHTML = `
            <div class="form-group">
                <label for="resposta-nome">Seu nome:</label>
                <input type="text" id="resposta-nome" name="resposta-nome" required>
            </div>
            <div class="form-group">
                <label for="resposta">Sua resposta:</label>
                <textarea id="resposta" name="resposta" required></textarea>
            </div>
            <button type="submit" class="btn-submit">Enviar Resposta</button>
        `;

        respostaForm.addEventListener('submit', function (e) {
            e.preventDefault();
            adicionarResposta(this, parentItem);
        });

        return respostaForm;
    }
    function adicionarResposta(form, parentItem) {
        const respostanome = form.querySelector('#resposta-nome').value;
        const resposta = form.querySelector('textarea').value;
    
        const respostaItem = criarElemento('div', null, 'esposta-item');
        const respostaNomeP = criarElemento('p', `Resposta de ${respostanome}:`);
        respostaNomeP.style.color = localStorage.getItem(`cor${respostanome}`);
        const respostaTexto = criarElemento('p', resposta);
    
        const respostaButton = criarElemento('button', 'Responder');
        respostaButton.addEventListener('click', function () {
            const novaRespostaForm = criarFormularioResposta(respostaItem);
            respostaItem.appendChild(novaRespostaForm);
            novaRespostaForm.style.display = 'block';
        });
    
        respostaItem.appendChild(respostaNomeP);
        respostaItem.appendChild(respostaTexto);
        respostaItem.appendChild(respostaButton);
    
        parentItem.appendChild(respostaItem);
        form.remove();
    
        // Update the respostas array in local storage
        const respostas = JSON.parse(localStorage.getItem('respostas')) || [];
        const comentarioNome = parentItem.querySelector('p:first-child').textContent.replace('Nome: ', '');
        let respostaItemIndex = respostas.findIndex(item => item.nome === comentarioNome);
        if (respostaItemIndex === -1) {
            respostas.push({ nome: comentarioNome, respostas: [{ nome: respostanome, texto: resposta }] });
        } else {
            if (!respostas[respostaItemIndex].respostas) {
                respostas[respostaItemIndex].respostas = [];
            }
            respostas[respostaItemIndex].respostas.push({ nome: respostanome, texto: resposta });
        }
        localStorage.setItem('respostas', JSON.stringify(respostas));
    }
    carregarComentarios();
});
