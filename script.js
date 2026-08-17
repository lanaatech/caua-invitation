lucide.createIcons();

// 1. NAVEGAÇÃO SPA E ROLAGEM SUAVE
function navigateView(viewId, hashTarget = null) {
    // 1. Esconde todas as visualizações
    document.getElementById('view-home').classList.add('hidden');
    document.getElementById('view-rsvp').classList.add('hidden');
    document.getElementById('view-galeria').classList.add('hidden');

    // 2. Mostra a visualização alvo
    const target = document.getElementById(`view-${viewId}`);
    if (target) target.classList.remove('hidden');

    // 3. Lógica de rolagem inteligente
    if (hashTarget) {
        // requestAnimationFrame garante que o navegador já desenhou a tela antes de mover
        requestAnimationFrame(() => {
            setTimeout(() => {
                const el = document.getElementById(hashTarget);
                if (el) {
                    const headerOffset = 90; // Altura do seu menu NASA para não cobrir o título
                    const elementPosition = el.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;
                    
                    window.scrollTo({
                         top: offsetPosition,
                         behavior: "smooth" // Agora ele reina sozinho!
                    });
                }
            }, 50);
        });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 2. CONTAGEM REGRESSIVA (20 de Setembro às 15:00)
function runCountdown() {
    const eventDate = new Date("September 20, 2026 15:00:00").getTime();

    setInterval(() => {
        const now = new Date().getTime();
        const difference = eventDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            document.getElementById("dias").innerText = String(days).padStart(2, '0');
            document.getElementById("horas").innerText = String(hours).padStart(2, '0');
            document.getElementById("minutos").innerText = String(minutes).padStart(2, '0');
            document.getElementById("segundos").innerText = String(seconds).padStart(2, '0');
        }
    }, 1000);
}
runCountdown();

// 3. LOGICA DO PIX
const chavePixExemplo = "caua.nasa@email.com";

function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').innerText = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

function copiarPix(valor, item) {
    navigator.clipboard.writeText(chavePixExemplo);
    showToast(`Código PIX copiado: ${item}`);
}

function copiarPixDirect() {
    navigator.clipboard.writeText(chavePixExemplo);
    showToast("Código PIX copiado com sucesso");
}

// 4. RSVP DINÂMICO
let countAcomp = 0;
function adicionarAcompanhante() {
    countAcomp++;
    const container = document.getElementById('listaAcompanhantes');
    const div = document.createElement('div');
    div.id = `acomp-${countAcomp}`;
    div.className = "p-3 rounded-sm bg-black border border-white/20 flex flex-col sm:flex-row gap-2 items-center";
    div.innerHTML = `
<input type="text" placeholder="Nome do tripulante" required class="w-full bg-slate-900 border border-white/10 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-nasaBlue acomp-nome font-mono" />
<select class="w-full sm:w-44 bg-slate-900 border border-white/10 rounded-sm px-2 py-2 text-xs text-white acomp-faixa font-mono">
  <option value="Adulto">Adulto</option>
  <option value="Adolescente">Adolescente</option>
  <option value="Criança">Criança</option>
</select>
<button type="button" onclick="removerAcompanhante(${countAcomp})" class="text-nasaRed hover:text-red-400 p-2">
  <i data-lucide="trash-2" class="w-4 h-4"></i>
</button>
`;
    container.appendChild(div);
    lucide.createIcons();
}

function removerAcompanhante(id) {
    const el = document.getElementById(`acomp-${id}`);
    if (el) el.remove();
}

function toggleComparecimento(vai) {
    const secao = document.getElementById('secaoAcompanhantes');
    if (!vai) {
        secao.classList.add('opacity-40', 'pointer-events-none');
    } else {
        secao.classList.remove('opacity-40', 'pointer-events-none');
    }
}

// 5. ENVIO DO FORMULÁRIO
function enviarConfirmacao(e) {
    e.preventDefault();
    const nome = document.getElementById('nomeTitular').value;
    const comparec = document.querySelector('input[name="comparecimento"]:checked').value;
    const faixa = document.getElementById('faixaEtariaTitular').value;
    const telefone = document.getElementById('telefone').value;

    const acomps = [];
    document.querySelectorAll('#listaAcompanhantes > div').forEach(row => {
        const nomeAcomp = row.querySelector('.acomp-nome').value;
        const faixaAcomp = row.querySelector('.acomp-faixa').value;
        if (nomeAcomp) acomps.push(`${nomeAcomp} (${faixaAcomp})`);
    });

    let msg = `*STATUS DE EMBARQUE - MISSÃO CAUÃ 1 🚀*%0A`;
    msg += `*Tripulante:* ${nome}%0A`;
    msg += `*Confirmação:* ${comparec.toUpperCase()}%0A`;
    msg += `*Categoria:* ${faixa}%0A`;
    msg += `*Comunicador:* ${telefone}%0A`;

    if (acomps.length > 0) {
        msg += `*Tripulação Adicional (${acomps.length}):*%0A- ` + acomps.join('%0A- ');
    }

    const numeroWhatsApp = "5571999999999";
    window.open(`https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${msg}`, '_blank');

    showToast("Dados transmitidos com sucesso!");
}

// 6. PREVIEW DE FOTOS
function previewUpload(event) {
    const files = event.target.files;
    const grid = document.getElementById('gridGaleria');

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = function (e) {
            const div = document.createElement('div');
            div.className = "aspect-square rounded-sm glass-box border border-nasaBlue/50 overflow-hidden relative animate-fade-in bg-black";
            div.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover" />`;
            grid.prepend(div);
        }
        reader.readAsDataURL(file);
    }
    showToast(`Upload de ${files.length} arquivo(s) concluído`);
}