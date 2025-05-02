document.addEventListener("DOMContentLoaded", () => {
    // Seletores de Elementos DOM
    const adminBtn = document.getElementById("admin-btn");
    const cadastroProdutoSection = document.getElementById("cadastro-produto");
    const formProduto = document.getElementById("form-produto");
    const nomeProdutoInput = document.getElementById("nome-produto");
    const linkProdutoInput = document.getElementById("link-produto");
    const imagemProdutoInput = document.getElementById("imagem-produto"); // Novo campo
    const categoriaProdutoSelect = document.getElementById("categoria-produto");
    const novaCategoriaInput = document.getElementById("nova-categoria");
    const produtosContainer = document.getElementById("produtos-container");
    const filtroCategoriaSelect = document.getElementById("filtro-categoria");
    const filtroOrdemSelect = document.getElementById("filtro-ordem");
    const aplicarFiltrosButton = document.getElementById("aplicar-filtros");

    // Estado da Aplicação (inicial)
    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    let categorias = JSON.parse(localStorage.getItem("categorias")) || [];
    const adminPassword = "123"; // Senha para acesso admin

    // --- Funções Principais ---

    // Função para carregar categorias nos selects
    function carregarCategorias() {
        console.log("Carregando categorias...");
        const categoriaSelecionadaCadastro = categoriaProdutoSelect.value;
        const categoriaSelecionadaFiltro = filtroCategoriaSelect.value;

        // Limpa opções existentes (exceto a primeira padrão)
        categoriaProdutoSelect.innerHTML = '<option value="">-- Selecione ou Crie --</option>';
        filtroCategoriaSelect.innerHTML = '<option value="todos">Todas as Categorias</option>';

        categorias.sort(); // Ordena categorias alfabeticamente

        categorias.forEach(cat => {
            const optionCadastro = document.createElement("option");
            optionCadastro.value = cat;
            optionCadastro.textContent = cat;
            categoriaProdutoSelect.appendChild(optionCadastro);

            const optionFiltro = document.createElement("option");
            optionFiltro.value = cat;
            optionFiltro.textContent = cat;
            filtroCategoriaSelect.appendChild(optionFiltro);
        });

        // Restaura a seleção anterior, se possível
        if (categorias.includes(categoriaSelecionadaCadastro)) {
             categoriaProdutoSelect.value = categoriaSelecionadaCadastro;
        }
        if (categorias.includes(categoriaSelecionadaFiltro) || categoriaSelecionadaFiltro === 'todos') {
            filtroCategoriaSelect.value = categoriaSelecionadaFiltro;
        }

        console.log("Categorias carregadas:", categorias);
    }

    // Função para exibir produtos na tela
    function exibirProdutos(produtosParaExibir = produtos) {
        console.log("Exibindo produtos:", produtosParaExibir);
        produtosContainer.innerHTML = ""; // Limpa container

        if (produtosParaExibir.length === 0) {
            produtosContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
            return;
        }

        // Aplica ordenação antes de exibir
        const ordem = filtroOrdemSelect.value;
        let produtosOrdenados = [...produtosParaExibir]; // Cria cópia para não modificar original

        switch (ordem) {
            case "recentes":
                produtosOrdenados.sort((a, b) => b.timestamp - a.timestamp);
                break;
            case "antigos":
                produtosOrdenados.sort((a, b) => a.timestamp - b.timestamp);
                break;
            case "az":
                produtosOrdenados.sort((a, b) => a.nome.localeCompare(b.nome));
                break;
            case "za":
                produtosOrdenados.sort((a, b) => b.nome.localeCompare(a.nome));
                break;
        }

        produtosOrdenados.forEach(produto => {
            const divProduto = document.createElement("div");
            divProduto.classList.add("produto-item");
            divProduto.dataset.id = produto.id;

            // Adiciona imagem se URL existir
            let imagemHTML = '';
            if (produto.imagemUrl) {
                // Adiciona onerror para caso a imagem falhe
                imagemHTML = `<img src="${produto.imagemUrl}" alt="${produto.nome}" onerror="this.style.display='none';">`;
            }

            divProduto.innerHTML = `
                ${imagemHTML}
                <h3>${produto.nome}</h3>
                <a href="${produto.link}" target="_blank" rel="noopener noreferrer">Acessar Link</a>
                <p>Categoria: ${produto.categoria || "Sem Categoria"}</p>
                <p><small>Cadastrado em: ${new Date(produto.timestamp).toLocaleString("pt-BR")}</small></p>
            `;
            produtosContainer.appendChild(divProduto);
        });
    }

    // Função para salvar no localStorage
    function salvarDados() {
        localStorage.setItem("produtos", JSON.stringify(produtos));
        localStorage.setItem("categorias", JSON.stringify(categorias));
        console.log("Dados salvos no localStorage.");
    }

    // Função para filtrar produtos
    function filtrarProdutos() {
        const categoriaFiltro = filtroCategoriaSelect.value;
        let produtosFiltrados = produtos;

        if (categoriaFiltro !== "todos") {
            produtosFiltrados = produtos.filter(p => p.categoria === categoriaFiltro);
        }
        // A ordenação é feita em exibirProdutos
        return produtosFiltrados;
    }

    // --- Event Listeners ---

    // Event Listener para o botão Admin
    adminBtn.addEventListener("click", () => {
        const passwordAttempt = prompt("Digite a senha de administrador:");
        if (passwordAttempt === adminPassword) {
            cadastroProdutoSection.style.display = cadastroProdutoSection.style.display === "none" ? "block" : "none";
        } else if (passwordAttempt !== null) { // Evita alert se o usuário cancelar o prompt
            alert("Senha incorreta!");
        }
    });

    // Event Listener para o formulário de cadastro
    formProduto.addEventListener("submit", (event) => {
        event.preventDefault();
        console.log("Formulário de cadastro submetido.");

        const nome = nomeProdutoInput.value.trim();
        const link = linkProdutoInput.value.trim();
        const imagemUrl = imagemProdutoInput.value.trim(); // Captura URL da imagem
        let categoria = categoriaProdutoSelect.value;
        const novaCategoria = novaCategoriaInput.value.trim();

        if (!nome || !link) {
            alert("Por favor, preencha o nome e o link do produto.");
            return;
        }

        // Define a categoria
        if (novaCategoria) {
            categoria = novaCategoria;
            if (!categorias.includes(categoria)) {
                categorias.push(categoria);
                carregarCategorias();
            }
        } else if (!categoria) {
             categoria = "Sem Categoria";
        }

        const novoProduto = {
            id: Date.now(),
            nome: nome,
            link: link,
            imagemUrl: imagemUrl, // Salva URL da imagem
            categoria: categoria,
            timestamp: Date.now()
        };

        produtos.push(novoProduto);
        salvarDados();
        exibirProdutos(filtrarProdutos());

        formProduto.reset();
        categoriaProdutoSelect.value = "";
        // Opcional: Ocultar formulário após cadastro bem-sucedido
        // cadastroProdutoSection.style.display = "none";

        console.log("Novo produto cadastrado:", novoProduto);
    });

    // Event Listener para aplicar filtros
    aplicarFiltrosButton.addEventListener("click", () => {
        console.log("Botão Aplicar Filtros clicado.");
        const produtosFiltrados = filtrarProdutos();
        exibirProdutos(produtosFiltrados);
    });

    // --- Inicialização ---
    console.log("Inicializando aplicação...");
    carregarCategorias();
    exibirProdutos(filtrarProdutos());
    console.log("Aplicação inicializada.");
});

