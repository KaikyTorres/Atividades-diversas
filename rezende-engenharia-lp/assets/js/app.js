/* Rezende Engenharia — formulário de consulta do CAR
 * Máscaras, validação de CPF/telefone e envio do lead.
 * Ajuste o bloco CONFIG antes de publicar.
 */
(function () {
  'use strict';

  var CONFIG = {
    // Endpoint que recebe o lead e dispara a consulta do CAR.
    // Vazio = a página cai no envio manual pelo WhatsApp.
    endpoint: '',

    // Número oficial da Rezende, só dígitos, com DDI 55. TROQUE ANTES DE PUBLICAR.
    whatsapp: '5500000000000',

    // Origem gravada junto com o lead, útil quando houver mais de uma campanha.
    origem: 'lp-car'
  };

  var form = document.querySelector('[data-form]');
  var recibo = document.querySelector('[data-sucesso]');
  var botao = document.querySelector('[data-enviar]');
  var botaoTexto = document.querySelector('[data-botao-texto]');
  var falha = document.querySelector('[data-falha]');
  var ecoTelefone = document.querySelector('[data-eco-telefone]');

  var campoNome = document.getElementById('nome');
  var campoTelefone = document.getElementById('telefone');
  var campoCpf = document.getElementById('cpf');
  var campoIsca = document.getElementById('empresa');

  /* ---------- utilidades ---------- */

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

  function mascaraCpf(valor) {
    var d = digitos(valor).slice(0, 11);
    var saida = d.slice(0, 3);
    if (d.length > 3) saida += '.' + d.slice(3, 6);
    if (d.length > 6) saida += '.' + d.slice(6, 9);
    if (d.length > 9) saida += '-' + d.slice(9);
    return saida;
  }

  function cpfValido(valor) {
    var d = digitos(valor);
    if (d.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(d)) return false;

    var soma = 0;
    var i;
    for (i = 0; i < 9; i++) soma += parseInt(d.charAt(i), 10) * (10 - i);
    var primeiro = (soma * 10) % 11;
    if (primeiro === 10) primeiro = 0;
    if (primeiro !== parseInt(d.charAt(9), 10)) return false;

    soma = 0;
    for (i = 0; i < 10; i++) soma += parseInt(d.charAt(i), 10) * (11 - i);
    var segundo = (soma * 10) % 11;
    if (segundo === 10) segundo = 0;
    return segundo === parseInt(d.charAt(10), 10);
  }

  function telefoneValido(valor) {
    var d = digitos(valor);
    if (d.length !== 10 && d.length !== 11) return false;
    if (parseInt(d.slice(0, 2), 10) < 11) return false;
    if (d.length === 11 && d.charAt(2) !== '9') return false;
    return true;
  }

  function nomeValido(valor) {
    return (valor || '').trim().split(/\s+/).length >= 2;
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
    ['nome', 'telefone', 'cpf'].forEach(function (campo) {
      mostrarErro(campo, '');
    });
    if (falha) {
      falha.hidden = true;
      falha.textContent = '';
    }
  }

  /* ---------- máscaras ---------- */

  function ligarMascara(campo, formatador) {
    campo.addEventListener('input', function () {
      campo.value = formatador(campo.value);
    });
  }

  ligarMascara(campoTelefone, mascaraTelefone);
  ligarMascara(campoCpf, mascaraCpf);

  [campoNome, campoTelefone, campoCpf].forEach(function (campo) {
    campo.addEventListener('blur', function () {
      if (campo.value.trim()) validar(campo.id);
    });
  });

  function validar(campo) {
    if (campo === 'nome') {
      if (!campoNome.value.trim()) return mostrarErro('nome', 'Informe seu nome.'), false;
      if (!nomeValido(campoNome.value)) return mostrarErro('nome', 'Informe o nome completo, com sobrenome.'), false;
      mostrarErro('nome', '');
      return true;
    }
    if (campo === 'telefone') {
      if (!campoTelefone.value.trim()) return mostrarErro('telefone', 'Informe seu WhatsApp.'), false;
      if (!telefoneValido(campoTelefone.value)) return mostrarErro('telefone', 'Número incompleto. Use DDD + número.'), false;
      mostrarErro('telefone', '');
      return true;
    }
    if (campo === 'cpf') {
      if (!campoCpf.value.trim()) return mostrarErro('cpf', 'Informe o CPF.'), false;
      if (!cpfValido(campoCpf.value)) return mostrarErro('cpf', 'Esse CPF não confere. Confira os números.'), false;
      mostrarErro('cpf', '');
      return true;
    }
    return true;
  }

  /* ---------- WhatsApp ---------- */

  function atualizarLinksWhatsApp(texto) {
    var alvos = document.querySelectorAll('[data-whatsapp-link]');
    Array.prototype.forEach.call(alvos, function (alvo) {
      alvo.setAttribute('href', 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto));
      alvo.setAttribute('target', '_blank');
      alvo.setAttribute('rel', 'noopener');
    });
  }

  function mensagemDaConsulta(dados) {
    return [
      'Olá! Quero consultar a situação do meu CAR.',
      'Nome: ' + dados.nome,
      'Telefone: ' + dados.telefoneFormatado,
      'CPF: ' + dados.cpfFormatado
    ].join('\n');
  }

  atualizarLinksWhatsApp('Olá! Quero saber a situação do CAR da minha fazenda.');

  /* ---------- envio ---------- */

  function mostrarRecibo(dados) {
    if (ecoTelefone) ecoTelefone.textContent = dados.telefoneFormatado;
    atualizarLinksWhatsApp(mensagemDaConsulta(dados));
    form.hidden = true;
    recibo.hidden = false;
    recibo.focus();
  }

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    limparErros();

    if (campoIsca && campoIsca.value) return; // armadilha de robô

    var ok = ['nome', 'telefone', 'cpf'].map(validar).every(Boolean);
    if (!ok) {
      var primeiro = form.querySelector('[aria-invalid="true"]');
      if (primeiro) primeiro.focus();
      return;
    }

    var dados = {
      nome: campoNome.value.trim().replace(/\s+/g, ' '),
      telefone: digitos(campoTelefone.value),
      telefoneFormatado: mascaraTelefone(campoTelefone.value),
      cpf: digitos(campoCpf.value),
      cpfFormatado: mascaraCpf(campoCpf.value),
      origem: CONFIG.origem
    };

    if (!CONFIG.endpoint) {
      mostrarRecibo(dados);
      return;
    }

    botao.disabled = true;
    botaoTexto.textContent = 'Enviando…';

    fetch(CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    })
      .then(function (resposta) {
        if (!resposta.ok) throw new Error('HTTP ' + resposta.status);
        mostrarRecibo(dados);
      })
      .catch(function () {
        falha.hidden = false;
        falha.textContent = 'Não conseguimos enviar agora. Tente de novo ou fale com a equipe no WhatsApp.';
        atualizarLinksWhatsApp(mensagemDaConsulta(dados));
      })
      .then(function () {
        botao.disabled = false;
        botaoTexto.textContent = 'Consultar meu CAR';
      });
  });

  document.querySelector('[data-nova-consulta]').addEventListener('click', function () {
    form.reset();
    limparErros();
    recibo.hidden = true;
    form.hidden = false;
    campoNome.focus();
  });
})();
