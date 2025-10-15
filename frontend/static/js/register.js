document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageArea = document.getElementById('messageArea');

    // Функція для отримання CSRF-токена з кукі (необхідно для POST-запитів у Django)
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                if (cookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Функція для відображення повідомлення
    function showMessage(type, message) {
        messageArea.textContent = message;
        messageArea.className = `message-area ${type}`;
        messageArea.classList.remove('hidden');
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Запобігаємо стандартній відправці форми
        messageArea.classList.add('hidden'); // Приховуємо попередні повідомлення

        const email = emailInput.value;
        const password = passwordInput.value;
        const csrftoken = getCookie('csrftoken');

        try {
            const response = await fetch('/api/user/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Успішна реєстрація (очікуємо статус 201 Created)
                showMessage('success', '✅ Реєстрація успішна! Ви можете увійти в систему.');
                form.reset(); // Очищаємо форму
                // Можна перенаправити на сторінку логіну:
                // window.location.href = '/login/';
            } else {
                // Обробка помилок сервера (400 Bad Request, 405 Method Not Allowed і т.д.)

                let errorMessage = 'Помилка реєстрації. Перевірте дані.';

                // Детальна обробка помилок (наприклад, невалідний пароль або email)
                if (data.email) {
                    errorMessage = `Помилка Email: ${data.email.join(' ')}`;
                } else if (data.password) {
                    errorMessage = `Помилка Пароля: ${data.password.join(' ')}`;
                } else if (data.detail) {
                    errorMessage = data.detail; // Загальні помилки DRF
                } else if (response.status === 405) {
                    errorMessage = 'Помилка: Недопустимий метод запиту (405).';
                }

                showMessage('error', `❌ ${errorMessage}`);
            }

        } catch (error) {
            console.error('Network or parsing error:', error);
            showMessage('error', '❌ Помилка з\'єднання. Спробуйте пізніше.');
        }
    });
});