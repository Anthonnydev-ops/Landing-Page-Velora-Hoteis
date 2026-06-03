// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// ════════════════════════════════════════════════════════
// 1. NAV — SCROLL BEHAVIOR
// ════════════════════════════════════════════════════════
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('nav-scrolled');
  } else {
    nav.classList.remove('nav-scrolled');
  }
});

// ════════════════════════════════════════════════════════
// 2. FORMULÁRIO — RESTRIÇÕES DE DATA
// ════════════════════════════════════════════════════════
const checkinInput  = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');

// Utilitário: retorna a data de hoje no formato YYYY-MM-DD
function getTodayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Utilitário: retorna o dia seguinte a uma data ISO
function getNextDayISO(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  date.setDate(date.getDate() + 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Bloqueia datas passadas no check-in
if (checkinInput) {
  checkinInput.setAttribute('min', getTodayISO());

  // Quando o check-in mudar, atualiza o min do check-out
  checkinInput.addEventListener('change', () => {
    if (checkinInput.value) {
      const minCheckout = getNextDayISO(checkinInput.value);
      checkoutInput.setAttribute('min', minCheckout);

      // Se o checkout atual for menor que o novo mínimo, limpa
      if (checkoutInput.value && checkoutInput.value < minCheckout) {
        checkoutInput.value = '';
      }
    }
  });
}

// ════════════════════════════════════════════════════════
// 3. VALIDAÇÃO + TOAST NOTIFICATION
// ════════════════════════════════════════════════════════
const btnReserva = document.querySelector('.btn-reserva');

// Cria e exibe o Toast dinâmico
function showToast(message) {
  // Remove toast anterior se existir
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `
    <div class="toast-icon">✓</div>
    <div class="toast-body">
      <strong class="toast-title">Reserva Enviada</strong>
      <p class="toast-msg">${message}</p>
    </div>
  `;

  document.body.appendChild(toast);

  // Força reflow antes de adicionar a classe de animação
  requestAnimationFrame(() => {
    toast.classList.add('toast-visible');
  });

  // Remove após 4 segundos
  setTimeout(() => {
    toast.classList.remove('toast-visible');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 4000);
}

// Validação ao clicar
if (btnReserva) {
  btnReserva.addEventListener('click', (e) => {
    e.preventDefault();

    const nomeInput  = document.getElementById('nome');
    const emailInput = document.getElementById('email');

    const fields = [
      { el: nomeInput,     value: nomeInput.value.trim() },
      { el: emailInput,    value: emailInput.value.trim() },
      { el: checkinInput,  value: checkinInput.value },
      { el: checkoutInput, value: checkoutInput.value },
    ];

    let isValid = true;

    fields.forEach(({ el, value }) => {
      if (!value) {
        isValid = false;
        el.classList.add('input-error');

        // Remove a borda vermelha após 2.5s
        setTimeout(() => el.classList.remove('input-error'), 2500);
      }
    });

    if (isValid) {
      showToast('Nossa equipe entrará em contato em até 2 horas. Obrigado por escolher a Velora!');

      // Limpa o formulário
      fields.forEach(({ el }) => (el.value = ''));
    }
  });
}
