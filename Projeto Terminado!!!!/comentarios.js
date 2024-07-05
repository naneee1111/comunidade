document.addEventListener("DOMContentLoaded", function() {
    const comentarioForm = document.getElementById('comentario-form');
    const listaComentarios = document.getElementById('lista-comentarios');

    const storageKey = 'comentarios_' + window.location.pathname;

    comentarioForm.addEventListener('submit', function (e) {
        e.preventDefault();
        adicionarComentario();
    });

    function adicionarComentario() {
        const nome = document.getElementById('nome').value;
        const comentario = document.getElementById('comentario').value;

        const novoComentario = { nome, comentario };

        const comentarios = JSON.parse(localStorage.getItem(storageKey)) || [];

        comentarios.push(novoComentario);

        localStorage.setItem(storageKey, JSON.stringify(comentarios));

        
        comentarioForm.reset();

        
        mostrarComentarios();
    }

    function mostrarComentarios() {
       
        listaComentarios.innerHTML = '';

       
        const comentarios = JSON.parse(localStorage.getItem(storageKey)) || [];

        comentarios.forEach(function (comentario) {
          
            if (comentario.nome.trim() === "" && comentario.comentario.trim() === "") {
                return;
            }

            const comentarioItem = document.createElement('div');
            comentarioItem.classList.add('comentario-item');

            const comentarioNome = document.createElement('p');
            comentarioNome.textContent = `Nome: ${comentario.nome}`;
            comentarioNome.style.fontWeight = 'bold';

            const comentarioTexto = document.createElement('p');
            comentarioTexto.textContent = comentario.comentario;

            comentarioItem.appendChild(comentarioNome);
            comentarioItem.appendChild(comentarioTexto);

            listaComentarios.appendChild(comentarioItem);
        });
    }

   
    mostrarComentarios();
});
