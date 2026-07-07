document.addEventListener("DOMContentLoaded", async () => {

    try {
        await carregarComponentes();
        await carregarSite();
    } catch (erro) {
        console.error("Erro geral:", erro);
    }

});

async function carregarComponentes() {

    const base = window.location.pathname.includes("/produtos/") ? "../" : "";

    await carregarHTML(base + "componentes/header.html", "header");
    await carregarHTML(base + "componentes/footer.html", "footer");

}

async function carregarHTML(caminho, id) {

    try {

        const elemento = document.getElementById(id);

        if (!elemento) {
            console.warn(`Elemento #${id} não encontrado no HTML`);
            return;
        }

        const resposta = await fetch(caminho);

        if (!resposta.ok) {
            throw new Error(`Erro ao carregar ${caminho}`);
        }

        const html = await resposta.text();
        elemento.innerHTML = html;

        console.log(`✅ ${id} carregado com sucesso`);

    } catch (erro) {
        console.error(`❌ Erro no ${id}:`, erro);
    }

}

async function carregarSite() {

    try {

        const site = await buscarJSON("dados/site.json");

        if (document.getElementById("cards")) {
            await carregarIndex(site);
        }

        if (document.getElementById("titulo")) {
            await carregarProduto();
        }

    } catch (erro) {
        console.error("Erro ao carregar site:", erro);
    }

}

async function buscarJSON(caminho) {

    const resposta = await fetch(caminho);

    if (!resposta.ok) {
        throw new Error(`Erro ao buscar ${caminho}`);
    }

    return await resposta.json();

}

async function carregarIndex(site) {

    const cards = document.getElementById("cards");

    for (const slug of site.produtos) {

        const produto = await buscarJSON(`dados/produtos/${slug}.json`);

        cards.innerHTML += `
        <a class="card" href="produto.html?produto=${produto.slug}">
            <img src="${produto.imagem}" alt="${produto.titulo}" loading="lazy">
            <h3>${produto.titulo}</h3>
        </a>
        `;
    }

}

async function carregarProduto() {

    const parametro = new URLSearchParams(location.search);
    const slug = parametro.get("produto");

    if (!slug) return;

    const produto = await buscarJSON(`dados/produtos/${slug}.json`);

    document.title = produto.metaTitle;

    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
        metaDesc.content = produto.descricao;
    }

    document.getElementById("titulo").textContent = produto.titulo;
    document.getElementById("texto").textContent = produto.texto;

    const imagem = document.getElementById("imagem");
    imagem.src = produto.imagem;
    imagem.alt = produto.titulo;
    imagem.className = "produto-imagem";

    carregarLista("beneficios", produto.beneficios);
    carregarLista("especies", produto.especies);

    await carregarLojas();
}

function carregarLista(id, lista) {

    const ul = document.getElementById(id);
    if (!ul) return;

    ul.innerHTML = "";

    lista.forEach(item => {
        ul.innerHTML += `<li>${item}</li>`;
    });

}

async function carregarLojas() {

    try {

        const base = window.location.pathname.includes("/produtos/") ? "../" : "";

        const resposta = await fetch(base + "componentes/onde-comprar.html");
        if (!resposta.ok) {
            throw new Error("Erro ao carregar onde-comprar.html");
        }

        const html = await resposta.text();

        const container = document.getElementById("ondeComprar");
        if (container) {
            container.innerHTML = html;
        } else {
            console.warn("Div #ondeComprar não encontrada");
        }

        const lojas = await buscarJSON(base + "lojas.json");

        const botoes = document.getElementById("botoes-lojas");
        if (botoes) {
            botoes.innerHTML = `
                <a class="botao" href="${lojas.shopee.url}" target="_blank">
                    ${lojas.shopee.icone} ${lojas.shopee.nome}
                </a>

                <a class="botao" href="${lojas.mercadolivre.url}" target="_blank">
                    ${lojas.mercadolivre.icone} ${lojas.mercadolivre.nome}
                </a>

                <a class="botao" href="${lojas.lojaintegrada.url}" target="_blank">
                    ${lojas.lojaintegrada.icone} ${lojas.lojaintegrada.nome}
                </a>
            `;
        }

    } catch (erro) {
        console.error("Erro ao carregar lojas:", erro);
    }

}

function voltarPagina() {
    if (document.referrer) {
        history.back();
    } else {
        window.location.href = "../index.html";
    }
}