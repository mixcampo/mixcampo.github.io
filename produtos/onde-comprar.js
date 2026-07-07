document.addEventListener("DOMContentLoaded", async () => {

    try {

        const container = document.getElementById("onde-comprar");

        if (!container) {
            console.warn("❌ #onde-comprar não encontrado");
            return;
        }

        const base = window.location.pathname.includes("/produtos/") ? "../" : "";

        // HTML
        const resposta = await fetch(base + "componentes/onde-comprar.html");

        if (!resposta.ok) {
            throw new Error("Erro ao carregar HTML");
        }

        container.innerHTML = await resposta.text();

        // JSON
        const lojas = await fetch(base + "lojas.json").then(r => r.json());

        const botoes = document.getElementById("botoes-lojas");

        // 🔥 pega nome do produto automaticamente (top!)
        const produto = window.location.pathname
            .split("/")
            .pop()
            .replace(".html", "");

        if (botoes) {
            botoes.innerHTML = `
                <a class="botao" href="${lojas.shopee.url}" target="_blank"
                onclick="gtag('event', 'click', {
                    event_category: 'saida',
                    event_label: 'shopee_${produto}'
                });">
                    ${lojas.shopee.icone} ${lojas.shopee.nome}
                </a>

                <a class="botao" href="${lojas.mercadolivre.url}" target="_blank"
                onclick="gtag('event', 'click', {
                    event_category: 'saida',
                    event_label: 'mercadolivre_${produto}'
                });">
                    ${lojas.mercadolivre.icone} ${lojas.mercadolivre.nome}
                </a>

                <a class="botao" href="${lojas.lojaintegrada.url}" target="_blank"
                onclick="gtag('event', 'click', {
                    event_category: 'saida',
                    event_label: 'site_${produto}'
                });">
                    ${lojas.lojaintegrada.icone} ${lojas.lojaintegrada.nome}
                </a>
            `;
        }

        console.log("✅ Onde comprar apareceu");

    } catch (erro) {
        console.error("❌ Erro onde comprar:", erro);
    }

});