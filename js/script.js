/* -----------------BURGER MENU----------------- */

const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
const overlay = document.getElementById('overlay');

burger.addEventListener('click', () => {
  menu.classList.toggle('active');
  overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
  menu.classList.remove('active');
  overlay.classList.remove('active');
});

const menuLinks = document.querySelectorAll('.mobile-menu a');

menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('active');
    overlay.classList.remove('active');
  });
});

/* -----------------PHONE MASK----------------- */

const phoneInput = document.getElementById('phone');

if (phoneInput) {

  phoneInput.addEventListener('focus', () => {
    if (!phoneInput.value) {
      phoneInput.value = '+7 (';
    }
  });

  phoneInput.addEventListener('input', () => {
    let value = phoneInput.value.replace(/\D/g, '');

    if (value.startsWith('8')) value = '7' + value.slice(1);
    if (!value.startsWith('7')) value = '7' + value;

    let result = '+7';

    if (value.length > 1) {
      result += ' (' + value.substring(1, 4);
    }
    if (value.length >= 5) {
      result += ') ' + value.substring(4, 7);
    }
    if (value.length >= 8) {
      result += '-' + value.substring(7, 9);
    }
    if (value.length >= 10) {
      result += '-' + value.substring(9, 11);
    }

    phoneInput.value = result;
  });

  phoneInput.addEventListener('keydown', (e) => {
    if (phoneInput.value.length >= 18 && e.key !== 'Backspace') {
      e.preventDefault();
    }
  });

}

function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");

    const toast = document.createElement("div");
    toast.classList.add("toast", type);
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-20px)";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* -----------------FORM VALIDATION----------------- */

const form = document.getElementById("bonusForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const dateInput = document.getElementById("date");

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const date = dateInput.value;

  // --- ИМЯ ---
  if (!name) {
    showToast("Введите имя", "error");
    nameInput.focus();
    return;
  }

  if (name.length < 2) {
    showToast("Имя слишком короткое", "error");
    nameInput.focus();
    return;
  }

  // --- ТЕЛЕФОН ---
  const digits = phone.replace(/\D/g, "");

  let normalized = digits;

  // 8XXXXXXXXXX → 7XXXXXXXXXX
  if (digits.length === 11 && digits.startsWith("8")) {
    normalized = "7" + digits.slice(1);
  }

  if (!/^7\d{10}$/.test(normalized)) {
    showToast("Введите корректный номер (+7 XXX XXX-XX-XX)", "error");
    phoneInput.focus();
    return;
  }

  // доп. проверка (чтобы не было 7000...)
  if (normalized[1] === "0") {
    showToast("Неверный код оператора", "error");
    phoneInput.focus();
    return;
  }

  // --- ДАТА ---
  if (!date) {
    showToast("Выберите дату рождения", "error");
    dateInput.focus();
    return;
  }

  const today = new Date();
  const birthDate = new Date(date);

  if (birthDate > today) {
    showToast("Дата не может быть в будущем", "error");
    dateInput.focus();
    return;
  }

  // --- УСПЕХ (отправка на сервер) ---
  fetch("http://localhost/HotPotE/save.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name,
      phone: normalized,
      date: date
    })
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(data => {
      if (data.success) {
        showToast("Заявка отправлена!", "success");
        form.reset();
      } else {
        showToast("Ошибка сохранения", "error");
      }
    })
    .catch(() => {
      showToast("Ошибка сервера", "error");
    });
});