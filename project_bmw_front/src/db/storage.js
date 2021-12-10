export default class Storage {
  saveItem(key, item) {
    localStorage.setItem(key, item);
  }

  getItem(key) {
    return localStorage.getItem(key);
  }

  clearItem(key) {
    localStorage.clear(key);
  }
}
