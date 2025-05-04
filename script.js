document.addEventListener("DOMContentLoaded", () => {
    // --- Dados Estáticos dos Produtos ---
    // Substitua este array pelos seus produtos reais
    const produtos = [
        {
            id: 1,
            nome: "Bola automática brinquedo de gato",
            link: "https://s.shopee.com.br/5AfcEodms6",
            imagemSrc: "images/bola_gato.png", // Caminho local da imagem
            categoria: "Pets",
            timestamp: new Date("2025-05-01T10:00:00Z").getTime()
        },
        {
            id: 2,
            nome: "Drones 8K 5G Novo Drone  GPS",
            link: "https://s.shopee.com.br/AKNia4CJFv?share_channel_code=1",
            imagemSrc: "images/drone_upscale.png", // Caminho local da imagem
            categoria: "Eletrônicos",
            timestamp: new Date("2025-05-02T11:30:00Z").getTime()
        },
        {
            id: 3,
            nome: "Videogame Portatil Jogos Retro 16GB",
            link: "https://s.shopee.com.br/1LSxKvWhxx",
            imagemSrc: "images/oie_console.jpg", // Caminho local da imagem
            categoria: "Eletrônicos",
            timestamp: new Date("2025-05-02T11:30:00Z").getTime()
        },
        {
            id: 4,
            nome: "Baseus Bowie WM02 TWS Fone De Ouvido Bluetooth Estéreo Sem Fio 5.2",
            link: "https://s.shopee.com.br/5VIWKkS1dU",
            imagemSrc: "images/Baseus_Fone.png", // Caminho local da imagem
            categoria: "Eletrônicos",
            timestamp: new Date("2025-05-02T11:30:00Z").getTime()
        },
        {
            id: 5,
            nome: "Projetor 4K HD 150 Multimídia Compatível com Celular, TV Box, PC, Wi-Fi e Bluetooth Bivolt IDALI LIFE",
            link: "https://s.shopee.com.br/8Uw7uUAwvq",
            imagemSrc: "images/Projetor wifi.png", // Caminho local da imagem
            categoria: "Eletrônicos",
            timestamp: new Date("2025-05-02T11:30:00Z").getTime()
        },
        
        
    ];

    // Deriva categorias dos produtos estáticos
    const categorias = [...new Set(produtos.map(p => p.categoria).filter(Boolean))]; // Filtra categorias vazias e pega valores únicos

    // --- Seletores de Elementos DOM ---
    // Elementos do formulário e admin removidos
    const produtosContainer = document.getElementById("produtos-container");
    const filtroCategoriaSelect = document.getElementById("filtro-categoria");
    const filtroOrdemSelect = document.getElementById("filtro-ordem");
    const aplicarFiltrosButton = document.getElementById("aplicar-filtros");

    // --- Funções Principais ---

    // Função para carregar categorias nos selects (adaptada para dados estáticos)
    function carregarCategorias() {
        console.log("Carregando categorias estáticas...");
        const categoriaSelecionadaFiltro = filtroCategoriaSelect.value;

        // Limpa opções existentes (exceto a primeira padrão)
        filtroCategoriaSelect.innerHTML = 
            '<option value="todos">Todas as Categorias</option>';

        categorias.sort(); // Ordena categorias alfabeticamente

        categorias.forEach(cat => {
            const optionFiltro = document.createElement("option");
            optionFiltro.value = cat;
            optionFiltro.textContent = cat;
            filtroCategoriaSelect.appendChild(optionFiltro);
        });

        // Restaura a seleção anterior, se possível
        if (categorias.includes(categoriaSelecionadaFiltro) || categoriaSelecionadaFiltro === 'todos') {
            filtroCategoriaSelect.value = categoriaSelecionadaFiltro;
        }

        console.log("Categorias estáticas carregadas:", categorias);
    }

    // Função para exibir produtos na tela (adaptada para imagem local)
    function exibirProdutos(produtosParaExibir = produtos) {
        console.log("Exibindo produtos estáticos:", produtosParaExibir);
        produtosContainer.innerHTML = ""; // Limpa container

        if (produtosParaExibir.length === 0) {
            produtosContainer.innerHTML = "<p>Nenhum produto encontrado com os filtros aplicados.</p>";
            return;
        }

        // Aplica ordenação antes de exibir
        const ordem = filtroOrdemSelect.value;
        let produtosOrdenados = [...produtosParaExibir];

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

            // Adiciona imagem se src existir
            let imagemHTML = '';
            if (produto.imagemSrc) {
                // Usa caminho local
                imagemHTML = `<img src="${produto.imagemSrc}" alt="${produto.nome}" onerror="this.style.display='none'; this.parentElement.querySelector('.produto-info').style.marginTop='0';">`;
            }

            divProduto.innerHTML = `
                ${imagemHTML}
                <div class="produto-info">
                    <h3>${produto.nome}</h3>
                    <a href="${produto.link}" target="_blank" rel="noopener noreferrer">Acessar Link</a>
                    <p class="categoria">Categoria: ${produto.categoria || "Sem Categoria"}</p>
                    <p><small>Cadastrado em: ${new Date(produto.timestamp).toLocaleString("pt-BR")}</small></p>
                </div>
            `;
            produtosContainer.appendChild(divProduto);
        });
    }

    // Função para filtrar produtos (adaptada para dados estáticos)
    function filtrarProdutos() {
        const categoriaFiltro = filtroCategoriaSelect.value;
        let produtosFiltrados = produtos; // Começa com todos os produtos estáticos

        if (categoriaFiltro !== "todos") {
            produtosFiltrados = produtos.filter(p => p.categoria === categoriaFiltro);
        }
        // A ordenação é feita em exibirProdutos
        return produtosFiltrados;
    }

    // --- Event Listeners ---
    // Listener do formulário e botão admin removidos

    // Event Listener para aplicar filtros
    aplicarFiltrosButton.addEventListener("click", () => {
        console.log("Botão Aplicar Filtros clicado.");
        const produtosFiltrados = filtrarProdutos();
        exibirProdutos(produtosFiltrados);
    });

    // --- Inicialização ---
    console.log("Inicializando aplicação com dados estáticos...");
    carregarCategorias();
    exibirProdutos(filtrarProdutos()); // Exibe produtos iniciais já filtrados/ordenados
    console.log("Aplicação estática inicializada.");
});

