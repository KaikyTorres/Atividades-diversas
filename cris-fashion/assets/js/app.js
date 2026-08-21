/* Cris Fashion — cadastro do grupo "Achadinhos da Cris Fashion"
 * Máscara e validação do WhatsApp, envio do lead e a contagem
 * regressiva da página de obrigado.
 * Ajuste o bloco CONFIG antes de publicar.
 */
(function () {
  'use strict';

  var CONFIG = {
    // Webhook do n8n que recebe o cadastro.
    // Vazio = a página vai direto para a confirmação, sem enviar nada.
    endpoint: 'https://n8n.usekaycrm.com/webhook/7465bf4c-b819-4933-8d34-89d0e0dc57f7',

    // Para onde a visitante vai depois do envio.
    paginaObrigado: 'obrigado.html',

    // Convite do grupo no WhatsApp, destino final do redirecionamento.
    grupo: 'https://chat.whatsapp.com/J15xI3EcaZ3Bx1p3YC168l',

    // Segundos que a página de obrigado espera antes de levar ao grupo.
    segundosRedirecionamento: 10,

    // Rótulo gravado junto com o lead, útil quando houver mais de uma campanha.
    origem: 'lp-achadinhos'
  };

  /* ---------- link do grupo (vale para as duas páginas) ---------- */

  var linksGrupo = document.querySelectorAll('[data-grupo-link]');
  Array.prototype.forEach.call(linksGrupo, function (link) {
    link.setAttribute('href', CONFIG.grupo);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
  });

  /* ---------- página de obrigado: barra de carregamento ---------- */

  var barra = document.querySelector('[data-barra]');

  if (barra) {
    var preenchimento = document.querySelector('[data-barra-preenchimento]');
    var contador = document.querySelector('[data-contador]');
    var total = CONFIG.segundosRedirecionamento * 1000;
    var inicio = Date.now();

    if (contador) contador.textContent = CONFIG.segundosRedirecionamento;

    var passo = setInterval(function () {
      var decorrido = Date.now() - inicio;
      var porcento = Math.min(100, (decorrido / total) * 100);

      if (preenchimento) preenchimento.style.width = porcento.toFixed(1) + '%';
      barra.setAttribute('aria-valuenow', Math.round(porcento));

      if (contador) {
        contador.textContent = Math.max(0, Math.ceil((total - decorrido) / 1000));
      }

      if (decorrido >= total) {
        clearInterval(passo);
        // replace() para que o botão "voltar" não caia de novo na contagem.
        window.location.replace(CONFIG.grupo);
      }
    }, 100);
  }

  var form = document.querySelector('[data-form]');
  if (!form) return; // página de obrigado: não tem formulário

  /* ---------- formulário ---------- */

  var botao = document.querySelector('[data-enviar]');
  var botaoTexto = document.querySelector('[data-botao-texto]');
  var textoOriginal = botaoTexto ? botaoTexto.textContent : '';
  var falha = document.querySelector('[data-falha]');
  var falhaTexto = document.querySelector('[data-falha-texto]');

  var campoNome = document.getElementById('nome');
  var campoTelefone = document.getElementById('telefone');
  var campoIsca = document.getElementById('empresa');

  function digitos(valor) {
    return (valor || '').replace(/\D/g, '');
  }

  function mascaraTelefone(valor) {
    var d = digitos(valor).slice(0, 11);
    if (d.length <= 2) return d.length ? '(' + d : '';
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  function telefoneValido(valor) {
    var d = digitos(valor);
    if (d.length !== 10 && d.length !== 11) return false;
    if (parseInt(d.slice(0, 2), 10) < 11) return false;
    if (d.length === 11 && d.charAt(2) !== '9') return false;
    return true;
  }

  function nomeValido(valor) {
    return (valor || '').trim().length >= 2;
  }

  function mostrarErro(campo, mensagem) {
    var alvo = document.querySelector('[data-erro="' + campo + '"]');
    if (alvo) alvo.textContent = mensagem || '';

    var entrada = document.getElementById(campo);
    if (!entrada) return;
    if (mensagem) entrada.setAttribute('aria-invalid', 'true');
    else entrada.removeAttribute('aria-invalid');
  }

  function limparErros() {
    ['nome', 'telefone'].forEach(function (campo) {
      mostrarErro(campo, '');
    });
    if (falha) falha.hidden = true;
  }

  campoTelefone.addEventListener('input', function () {
    campoTelefone.value = mascaraTelefone(campoTelefone.value);
  });

  [campoNome, campoTelefone].forEach(function (campo) {
    campo.addEventListener('blur', function () {
      if (campo.value.trim()) validar(campo.id);
    });
  });

  function validar(campo) {
    if (campo === 'nome') {
      if (!campoNome.value.trim()) return mostrarErro('nome', 'Informe o seu nome.'), false;
      if (!nomeValido(campoNome.value)) return mostrarErro('nome', 'Nome muito curto. Confira.'), false;
      mostrarErro('nome', '');
      return true;
    }
    if (campo === 'telefone') {
      if (!campoTelefone.value.trim()) return mostrarErro('telefone', 'Informe o seu WhatsApp.'), false;
      if (!telefoneValido(campoTelefone.value)) return mostrarErro('telefone', 'Número incompleto. Use DDD + número.'), false;
      mostrarErro('telefone', '');
      return true;
    }
    return true;
  }

  /* ---------- envio ---------- */

  function irParaObrigado() {
    // replace() em vez de href: o botão "voltar" não volta para o formulário
    // preenchido, então ninguém reenvia o mesmo cadastro sem querer.
    window.location.replace(CONFIG.paginaObrigado);
  }

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    limparErros();

    if (campoIsca && campoIsca.value) return; // armadilha de robô

    var ok = ['nome', 'telefone'].map(validar).every(Boolean);
    if (!ok) {
      var primeiro = form.querySelector('[aria-invalid="true"]');
      if (primeiro) primeiro.focus();
      return;
    }

    var dados = {
      nome: campoNome.value.trim().replace(/\s+/g, ' '),
      telefone: digitos(campoTelefone.value),
      telefoneFormatado: mascaraTelefone(campoTelefone.value),
      whatsapp: '55' + digitos(campoTelefone.value),
      origem: CONFIG.origem,
      grupo: 'Achadinhos da Cris Fashion',
      enviadoEm: new Date().toISOString()
    };

    if (!CONFIG.endpoint) {
      irParaObrigado();
      return;
    }

    botao.disabled = true;
    if (botaoTexto) botaoTexto.textContent = 'Enviando…';

    fetch(CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    })
      .then(function (resposta) {
        if (!resposta.ok) throw new Error('HTTP ' + resposta.status);
        irParaObrigado();
      })
      .catch(function () {
        botao.disabled = false;
        if (botaoTexto) botaoTexto.textContent = textoOriginal;
        falhaTexto.textContent = 'Não conseguimos salvar o seu cadastro agora. Tente de novo em instantes ou entre direto no grupo.';
        falha.hidden = false;
      });
  });
})();
