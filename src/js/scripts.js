// ════════════════════════════════════════════════════════
// VALIDAÇÃO DO FORMULÁRIO E NOTIFICAÇÃO DE RESERVA (TOAST)
//
// Este arquivo controla apenas o envio do formulário de
// reserva. Ao clicar no botão, os campos obrigatórios são
// verificados. Se estiverem preenchidos, uma mensagem de
// confirmação é exibida na tela.
// ════════════════════════════════════════════════════════

// Seleciona o botão de envio do formulário de reserva
const botaoReserva = document.querySelector('.btn-reserva');

// ────────────────────────────────────────────────────────
// Função: exibirToast
// Descrição: cria e exibe uma notificação flutuante (Toast)
//            no canto inferior direito da tela.
// Parâmetro: mensagem — texto que será exibido na notificação
// ────────────────────────────────────────────────────────
function exibirToast(mensagem) {
  // Remove uma notificação anterior, se ela ainda estiver visível
  const toastAnterior = document.querySelector('.toast-notification');
  if (toastAnterior) {
    toastAnterior.remove();
  }

  // Cria o elemento HTML da notificação
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `
    <div class="toast-icon">✓</div>
    <div class="toast-body">
      <strong class="toast-title">Reserva Enviada</strong>
      <p class="toast-msg">${mensagem}</p>
    </div>
  `;

  // Adiciona a notificação ao final do <body>
  document.body.appendChild(toast);

  // Aguarda o próximo frame do navegador para aplicar a
  // animação de entrada (a classe CSS precisa ser adicionada
  // após o elemento estar no DOM)
  requestAnimationFrame(() => {
    toast.classList.add('toast-visible');
  });

  // Remove a notificação após 4 segundos
  setTimeout(() => {
    toast.classList.remove('toast-visible');

    // Aguarda a animação de saída terminar antes de remover o elemento
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }, 4000);
}

// ────────────────────────────────────────────────────────
// Evento: clique no botão "Consultar Disponibilidade"
// Descrição: verifica se todos os campos obrigatórios foram
//            preenchidos antes de simular o envio.
// ────────────────────────────────────────────────────────
if (botaoReserva) {
  botaoReserva.addEventListener('click', function (evento) {
    // Impede o comportamento padrão do botão (recarregar a página)
    evento.preventDefault();

    // Obtém as referências dos campos obrigatórios do formulário
    const campoNome     = document.getElementById('nome');
    const campoEmail    = document.getElementById('email');
    const campoCheckin  = document.getElementById('checkin');
    const campoCheckout = document.getElementById('checkout');

    // Lista com os campos que serão validados
    var camposFormulario = [
      { elemento: campoNome,     valor: campoNome.value.trim() },
      { elemento: campoEmail,    valor: campoEmail.value.trim() },
      { elemento: campoCheckin,  valor: campoCheckin.value },
      { elemento: campoCheckout, valor: campoCheckout.value },
    ];

    // Assume que o formulário está válido até encontrar algum campo vazio
    var formularioValido = true;

    // Percorre cada campo e verifica se está preenchido
    camposFormulario.forEach(function (campo) {
      if (!campo.valor) {
        // Campo vazio: marca o formulário como inválido e adiciona borda de erro
        formularioValido = false;
        campo.elemento.classList.add('input-error');

        // Remove a borda de erro após 2,5 segundos
        setTimeout(function () {
          campo.elemento.classList.remove('input-error');
        }, 2500);
      }
    });

    // Se todos os campos estiverem preenchidos, simula o envio
    if (formularioValido) {
      // Exibe a notificação de sucesso
      exibirToast('Nossa equipe entrará em contato em até 2 horas. Obrigado por escolher a Velora!');

      // Limpa os campos do formulário após o envio
      camposFormulario.forEach(function (campo) {
        campo.elemento.value = '';
      });
    }
  });
}
