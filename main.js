// Elementos DOM
const campoSenha = document.getElementById('campo-senha');
const tamanhoTexto = document.getElementById('tamanho-senha');
const btnMenos = document.getElementById('btn-menos');
const btnMais = document.getElementById('btn-mais');
const chkMaiusculas = document.getElementById('chk-maiusculas');
const chkMinusculas = document.getElementById('chk-minusculas');
const chkNumeros = document.getElementById('chk-numeros');
const chkSimbolos = document.getElementById('chk-simbolos');
const forcaBarra = document.getElementById('forca-barra-preencher');
const forcaRotulo = document.getElementById('forca-rotulo');
const btnCopiar = document.getElementById('copiar-senha');

// Conjuntos de caracteres
const letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const letrasMinusculas = 'abcdefghijklmnopqrstuvwxyz';
const numeros = '0123456789';
const simbolos = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Estado
let tamanho = 12;
let senhaAtual = '';

// Função para gerar senha aleatória
function gerarSenha() {
    // Construir conjunto de caracteres baseado nas checkboxes
    let caracteres = '';
    if (chkMaiusculas.checked) caracteres += letrasMaiusculas;
    if (chkMinusculas.checked) caracteres += letrasMinusculas;
    if (chkNumeros.checked) caracteres += numeros;
    if (chkSimbolos.checked) caracteres += simbolos;

    // Se nenhuma opção estiver marcada, usar pelo menos minúsculas
    if (caracteres === '') {
        caracteres = letrasMinusculas;
        chkMinusculas.checked = true;
    }

    // Gerar senha
    let senha = '';
    const comprimento = Math.max(1, tamanho); // garantir pelo menos 1 caractere
    
    for (let i = 0; i < comprimento; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        senha += caracteres[indice];
    }

    senhaAtual = senha;
    campoSenha.value = senha;
    
    // Atualizar força da senha
    atualizarForca(senha);
}

// Função para avaliar força da senha
function atualizarForca(senha) {
    let score = 0;
    const comprimento = senha.length;
    
    // Critério 1: Comprimento
    if (comprimento >= 12) score += 2;
    else if (comprimento >= 8) score += 1;
    
    // Critério 2: Tipos de caracteres usados
    let tiposUsados = 0;
    if (/[a-z]/.test(senha)) tiposUsados++;
    if (/[A-Z]/.test(senha)) tiposUsados++;
    if (/[0-9]/.test(senha)) tiposUsados++;
    if (/[^a-zA-Z0-9]/.test(senha)) tiposUsados++;
    
    score += tiposUsados;
    
    // Critério 3: Penalidade para senhas muito curtas
    if (comprimento < 4) score = 0;
    
    // Determinar força (0-6)
    let forca = 'Fraca';
    let cor = '#ff4444';
    let porcentagem = 20;
    
    if (score >= 5 && comprimento >= 12) {
        forca = 'Forte';
        cor = '#44ff88';
        porcentagem = 100;
    } else if (score >= 3 && comprimento >= 8) {
        forca = 'Média';
        cor = '#ffaa44';
        porcentagem = 60;
    } else if (score >= 2 && comprimento >= 6) {
        forca = 'Média';
        cor = '#ffaa44';
        porcentagem = 55;
    } else {
        forca = 'Fraca';
        cor = '#ff4444';
        porcentagem = Math.min(20 + score * 5, 35);
    }
    
    // Atualizar UI
    forcaBarra.style.width = porcentagem + '%';
    forcaBarra.style.background = cor;
    forcaRotulo.textContent = forca;
    forcaRotulo.style.color = cor;
}

// Função para atualizar tamanho e regenerar
function atualizarTamanho(novoTamanho) {
    tamanho = Math.max(1, Math.min(50, novoTamanho));
    tamanhoTexto.textContent = tamanho;
    gerarSenha();
}

// Event listeners dos botões
btnMenos.addEventListener('click', () => {
    atualizarTamanho(tamanho - 1);
});

btnMais.addEventListener('click', () => {
    atualizarTamanho(tamanho + 1);
});

// Event listeners das checkboxes
chkMaiusculas.addEventListener('change', gerarSenha);
chkMinusculas.addEventListener('change', gerarSenha);
chkNumeros.addEventListener('change', gerarSenha);
chkSimbolos.addEventListener('change', gerarSenha);

// Botão copiar
btnCopiar.addEventListener('click', async () => {
    if (!senhaAtual) {
        gerarSenha();
    }
    try {
        await navigator.clipboard.writeText(senhaAtual);
        // Feedback visual
        const originalText = btnCopiar.innerHTML;
        btnCopiar.innerHTML = '<i class="fas fa-check"></i>';
        btnCopiar.style.color = '#44ff88';
        setTimeout(() => {
            btnCopiar.innerHTML = originalText;
            btnCopiar.style.color = '';
        }, 1500);
    } catch (err) {
        // Fallback para navegadores antigos
        campoSenha.select();
        document.execCommand('copy');
        alert('Senha copiada!');
    }
});

// Inicializar
gerarSenha();