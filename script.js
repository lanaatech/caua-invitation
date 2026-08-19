// Inicialize o Supabase no topo do script.js
const supabaseUrl = 'https://mvekkwmtbjqhpzdjozjm.supabase.co';
const supabaseKey = 'sb_publishable_ZvlaKGJMAdOduqa57hgHkQ_5erEOa8w';
// Mudamos o nome aqui para supabaseClient para não dar conflito com a biblioteca global
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

lucide.createIcons();

// ==============================================================
// 1. MENU MOBILE (Hambúrguer)
// ==============================================================
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.toggle('hidden');
        menu.classList.toggle('flex');
    }
}



// 1. NAVEGAÇÃO SPA E ROLAGEM SUAVE
function navigateView(viewId, hashTarget = null) {
    // 1. Esconde todas as visualizações
    document.getElementById('view-home').classList.add('hidden');
    document.getElementById('view-rsvp').classList.add('hidden');
    document.getElementById('view-galeria').classList.add('hidden');

    // 2. Mostra a visualização alvo
    const target = document.getElementById(`view-${viewId}`);
    if (target) target.classList.remove('hidden');

    // 3. Fechar menu mobile automaticamente ao clicar no link
    const menu = document.getElementById('mobileMenu');
    if (menu && !menu.classList.contains('hidden') && window.innerWidth < 768) {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
    }

    // 4. Lógica de rolagem inteligente
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
const chavePixExemplo = "71986301866";

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

// Alternância da Escolha de Presente (Passo 6)
function togglePresente(tipo) {
    const panelFisico = document.getElementById('panel-presente-fisico');
    const panelPix = document.getElementById('panel-presente-pix');

    if (tipo === 'fisico') {
        panelFisico.classList.remove('hidden');
        panelPix.classList.add('hidden');
    } else {
        panelFisico.classList.add('hidden');
        panelPix.classList.remove('hidden');
    }
}

// 5. ENVIO DO FORMULÁRIO (WhatsApp + Banco de Dados + Limpeza)
async function enviarConfirmacao(e) {
    e.preventDefault();
    const nome = document.getElementById('nomeTitular').value;
    const comparec = document.querySelector('input[name="comparecimento"]:checked').value;
    const faixa = document.getElementById('faixaEtariaTitular').value;
    const telefone = document.getElementById('telefone').value;

    // Captura o tipo de presente selecionado
    const opcaoPresenteSelecionada = document.querySelector('input[name="tipo_presente"]:checked');
    const presente = opcaoPresenteSelecionada ? (opcaoPresenteSelecionada.value === 'fisico' ? 'Levar de Casa' : 'PIX') : 'Não informado';

    const acomps = [];
    
    // Inicia a contagem contando o próprio titular
    let qtdAdultos = (faixa === 'Adulto' || faixa === 'Adolescente') ? 1 : 0;
    let qtdCriancas = faixa === 'Criança' ? 1 : 0;

    // Varre a lista de acompanhantes e faz a matemática
    document.querySelectorAll('#listaAcompanhantes > div').forEach(row => {
        const nomeAcomp = row.querySelector('.acomp-nome').value;
        const faixaAcomp = row.querySelector('.acomp-faixa').value;
        if (nomeAcomp) {
            acomps.push(`${nomeAcomp} (${faixaAcomp})`);
            if (faixaAcomp === 'Adulto' || faixaAcomp === 'Adolescente') qtdAdultos++;
            if (faixaAcomp === 'Criança') qtdCriancas++;
        }
    });

    // Formata o texto que vai para a coluna 'acompanhantes' do banco
    const temAcompanhante = acomps.length > 0 ? "SIM" : "NÃO";
    const detalheParaBanco = acomps.length > 0 
        ? `Tem Acompanhante: ${temAcompanhante} | Total na família: ${qtdAdultos} Adulto(s) e ${qtdCriancas} Criança(s) | Nomes: ${acomps.join(', ')}`
        : `Tem Acompanhante: ${temAcompanhante} | Total na família: ${qtdAdultos} Adulto(s) e ${qtdCriancas} Criança(s)`;

    // Dados formatados para o Supabase
    const dadosParaSalvar = {
        nome: nome,
        status: comparec,
        categoria: faixa,
        telefone: telefone,
        presente: presente,
        acompanhantes: detalheParaBanco // Agora enviando o texto rico para o banco!
    };

    // Usando supabaseClient
    const { data, error } = await supabaseClient
        .from('rsvp_caua')
        .insert([dadosParaSalvar]);

    if (error) {
        console.error("Erro ao salvar:", error);
        showToast("Erro de comunicação com a base. Tente novamente.");
        return; // Interrompe se der erro
    }

    // Monta a mensagem do WhatsApp
    let msg = `*STATUS DE EMBARQUE - MISSÃO CAUÃ 1 🚀*%0A`;
    msg += `*Tripulante:* ${nome}%0A`;
    msg += `*Confirmação:* ${comparec.toUpperCase()}%0A`;
    msg += `*Categoria:* ${faixa}%0A`;
    msg += `*Comunicador:* ${telefone}%0A`;

    if (acomps.length > 0) {
        msg += `*Tripulação Adicional (${acomps.length}):*%0A- ` + acomps.join('%0A- ');
    }

    const numeroWhatsApp = "5571993204274";
    window.open(`https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${msg}`, '_blank');

    // ==========================================
    // LIMPEZA DO FORMULÁRIO E MENSAGEM FINAL
    // ==========================================
    showToast("Obrigado pela confirmação! Te esperamos na base.");
    
    // Reseta todos os inputs
    document.getElementById('formRsvp').reset();
    
    // Apaga os acompanhantes extras que foram adicionados na tela
    document.getElementById('listaAcompanhantes').innerHTML = '';
    countAcomp = 0;
    
    // Esconde as áreas de presente
    const panelFisico = document.getElementById('panel-presente-fisico');
    const panelPix = document.getElementById('panel-presente-pix');
    if(panelFisico) panelFisico.classList.add('hidden');
    if(panelPix) panelPix.classList.add('hidden');

    // Volta para a tela inicial suavemente após 2 segundos
    setTimeout(() => {
        navigateView('home');
    }, 2000);
}

// 6. PREVIEW E UPLOAD DE FOTOS (Supabase Storage)
async function previewUpload(event) {
    const files = event.target.files;
    const grid = document.getElementById('gridGaleria');

    if (files.length === 0) return;

    showToast(`Iniciando transmissão de ${files.length} arquivo(s)... ⏳`);

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 1. Cria um nome único para a imagem
        const extensao = file.name.split('.').pop();
        const nomeArquivo = `${Date.now()}-${Math.random().toString(36).substring(2)}.${extensao}`;

        // 2. Usando supabaseClient
        const { data, error } = await supabaseClient.storage
            .from('galeria_caua')
            .upload(nomeArquivo, file);

        if (error) {
            console.error('Falha no upload:', error);
            showToast(`Erro ao transmitir a imagem ${i + 1}`);
            continue;
        }

        // 3. Pegando a URL com supabaseClient
        const { data: publicData } = supabaseClient.storage
            .from('galeria_caua')
            .getPublicUrl(nomeArquivo);

        // 4. Cria o "quadro" na tela e insere a foto vinda direto do Supabase
        const div = document.createElement('div');
        div.className = "aspect-square rounded-sm glass-box border border-nasaBlue/50 overflow-hidden relative animate-fade-in bg-black";
        div.innerHTML = `<img src="${publicData.publicUrl}" class="w-full h-full object-cover" />`;

        // Coloca a nova foto como a primeira do grid
        grid.prepend(div);
    }

    showToast('Upload concluído com sucesso! 🚀');
}

// ==============================================================
// 7. FUNÇÃO DE DOWNLOAD DIRETO (Especial para Celulares)
// ==============================================================
async function baixarFoto(url, nomeArquivo) {
    showToast("Baixando imagem... ⏳");
    try {
        // Transforma o link da imagem num arquivo local temporário
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        // Cria um link escondido, clica nele para baixar e depois destrói
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = blobUrl;
        link.download = nomeArquivo || 'missao-caua.jpg';
        document.body.appendChild(link);
        link.click();
        
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(link);
    } catch (error) {
        console.error("Erro no download:", error);
        // Plano B: Se o celular bloquear o fetch, abre a foto numa nova aba
        window.open(url, '_blank');
    }
}

// ==============================================================
// 8. CARREGAR E EXIBIR FOTOS NA GALERIA 
// ==============================================================
async function carregarGaleria() {
    const grid = document.getElementById('gridGaleria');
    
    // Busca os arquivos especificando limites para não travar
    const { data, error } = await supabaseClient.storage.from('galeria_caua').list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
    });

    if (error) {
        console.error('Erro ao carregar galeria:', error);
        grid.innerHTML = '<p class="col-span-full text-center text-nasaRed text-xs mt-8">Falha na comunicação visual. RLS Bloqueado.</p>';
        return;
    }

    grid.innerHTML = ''; // Limpa o aviso de "Acessando banco"

    // Filtra pastas vazias do sistema
    const arquivosValidos = data.filter(file => file.name !== '.emptyFolderPlaceholder' && file.name !== '');

    if (arquivosValidos.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-center text-slate-500 text-xs mt-8">Nenhum registro visual encontrado. Seja o primeiro a enviar!</p>';
        return;
    }

    arquivosValidos.forEach(file => {
        const { data: publicData } = supabaseClient.storage.from('galeria_caua').getPublicUrl(file.name);
        
        const div = document.createElement('div');
        // A classe 'group' é necessária para os efeitos de hover
        div.className = "aspect-square rounded-sm glass-box border border-white/20 overflow-hidden group relative bg-black";
        
        // Inserimos a foto e o botão de download
        div.innerHTML = `
            <img src="${publicData.publicUrl}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500" />
            <button onclick="baixarFoto('${publicData.publicUrl}', '${file.name}')" title="Baixar Imagem" class="absolute bottom-2 right-2 bg-nasaBlue/90 text-white p-2.5 rounded-sm opacity-0 group-hover:opacity-100 max-md:opacity-100 transition-opacity duration-300 hover:bg-nasaBlue z-10 shadow-lg flex items-center justify-center backdrop-blur-sm border border-nasaBlue">
                <i data-lucide="download" class="w-4 h-4"></i>
            </button>
        `;
        
        grid.appendChild(div);
    });
    
    // Como criamos ícones novos na tela, mandamos renderizá-los
    lucide.createIcons();
}
// Aciona a busca de fotos assim que o script carrega
carregarGaleria();

// ==============================================================
// 9. PREVIEW E UPLOAD DE NOVAS FOTOS
// ==============================================================
async function previewUpload(event) {
    const files = event.target.files;
    const grid = document.getElementById('gridGaleria');

    if (files.length === 0) return;

    if (grid.innerHTML.includes('Nenhum registro visual encontrado') || grid.innerHTML.includes('Acessando banco')) {
        grid.innerHTML = '';
    }

    showToast(`Iniciando transmissão de ${files.length} arquivo(s)... ⏳`);

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const extensao = file.name.split('.').pop();
        const nomeArquivo = `${Date.now()}-${Math.random().toString(36).substring(2)}.${extensao}`;

        const { error } = await supabaseClient.storage
            .from('galeria_caua')
            .upload(nomeArquivo, file);

        if (error) {
            console.error('Falha no upload:', error);
            showToast(`Erro ao transmitir a imagem ${i + 1}`);
            continue;
        }

        const { data: publicData } = supabaseClient.storage
            .from('galeria_caua')
            .getPublicUrl(nomeArquivo);

        const div = document.createElement('div');
        div.className = "aspect-square rounded-sm glass-box border border-nasaBlue/50 overflow-hidden relative animate-fade-in bg-black group";
        div.innerHTML = `
            <img src="${publicData.publicUrl}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500" />
            <button onclick="baixarFoto('${publicData.publicUrl}', '${nomeArquivo}')" title="Baixar Imagem" class="absolute bottom-2 right-2 bg-nasaBlue/90 text-white p-2.5 rounded-sm opacity-0 group-hover:opacity-100 max-md:opacity-100 transition-opacity duration-300 hover:bg-nasaBlue z-10 shadow-lg flex items-center justify-center backdrop-blur-sm border border-nasaBlue">
                <i data-lucide="download" class="w-4 h-4"></i>
            </button>
        `;

        grid.prepend(div);
    }

    lucide.createIcons();
    showToast('Upload concluído com sucesso! 🚀');
}