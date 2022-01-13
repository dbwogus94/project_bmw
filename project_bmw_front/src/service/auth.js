export default class AuthService {
  constructor(http, storage) {
    this.http = http;
    this.storage = storage;
  }

  async signup(username, password, name, email) {
    const data = await this.http.fetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, password, name, email }),
    });

    this.storage.saveItem('USERNAME', username);
    return data;
  }

  async login(username, password) {
    const data = await this.http.fetch('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    this.storage.saveItem('USERNAME', username);
    return data;
  }

  async me() {
    const username = this.storage.getItem('USERNAME');
    return !!username
      ? this.http.fetch(`/auth/me`, {
          method: 'GET',
        })
      : undefined;
  }

  async logout() {
    this.storage.clearItem('USERNAME');
    await this.http.fetch('/auth/signout', {
      method: 'GET',
    });
  }
}
