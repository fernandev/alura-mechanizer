const Browser = require('./Browser');

class Alura {
	static get baseUrl() {
		return 'https://cursos.alura.com.br/';
	}

	static get loginUrl() {
		return Alura.baseUrl + 'loginForm';
	}

	static async login() {
		await Browser.page.goto(Alura.loginUrl);
		const loginInfo = {
			email: '',
			password: ''
		};

		const emailField = await Browser.page.$('#login-email');
		await emailField.focus();
		await Browser.page.keyboard.type(loginInfo.email);

		const passwordField = await Browser.page.$('#password');
		await passwordField.focus();
		await Browser.page.keyboard.type(loginInfo.password);

		const loginButton = await Browser.page.$('form > button[class="btn-login"]');
		await loginButton.click();
		await Browser.page.waitForNavigation({ waitUntil: 'networkidle0' });
	}
}

module.exports = Alura;