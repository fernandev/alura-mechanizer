const Browser = require('./Browser');

class Alura {
    static get baseUrl() {
        return 'https://cursos.alura.com.br/';
    }

    static get loginUrl() {
        return Alura.baseUrl + 'loginForm';
    }

    static async login() {
        const loginInfo = {
            email: '',
            password: ''
        };

        await Browser.page.goto(Alura.loginUrl);
        const login_structure = await Browser.page.evaluate((loginInfo) => {
            const loginInput = document.querySelector('input#login-email');
            const passwordInput = document.querySelector('input#password');
            const submitButton = document.querySelector('button[type="submit"]');

            if (loginInput) loginInput.value = loginInfo.email;
            if (passwordInput) passwordInput.value = loginInfo.password;
            if (submitButton) submitButton.click();

            return (!!loginInput && !!passwordInput && !!submitButton);
        }, loginInfo);

        if (!login_structure)  throw new Error('Login page structure was modified.');
        await Browser.page.waitForNavigation({ waitUntil: 'networkidle0' });
    }
}

module.exports = Alura;