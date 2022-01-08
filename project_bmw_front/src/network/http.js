export default class HttpClient {
  constructor(baseURL, storage, authErrorEventBus) {
    this.baseURL = baseURL;
    this.storage = storage;
    this.authErrorEventBus = authErrorEventBus;
  }

  async fetch(url, options) {
    /* ### fetch API 사용 */
    const res = await fetch(`${this.baseURL}${url}`, {
      ...options,
      // 같은 도메인 다른 포트에서 쿠키를 공유하기 위한 설정
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    let data;

    try {
      data = res.status !== 204 ? await res.json() : undefined;
    } catch (error) {
      console.error(error);
    }

    // 200번대 제외
    if (res.status > 299 || res.status < 200) {
      const message =
        data && data.message //
          ? data.message
          : 'Something went wrong!';
      const error = new Error(message);

      if (res.status === 401) {
        // 401에러 -> 로그인 페이지
        this.storage.clearItem('USERNAME');
        this.authErrorEventBus.notify(error);
        return;
      }
      // 401 이외의 에러는 에러를 던진다.
      throw error;
    }
    return data;
  }
}
