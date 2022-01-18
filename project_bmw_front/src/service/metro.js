export default class MetroService {
  metroList = {
    // 경의중앙선: [
    //   {
    //     id: 1, // 버스 번호
    //     label: 'M',
    //     name: '야당역',
    //     username: '경의중앙선',
    //     username_id: 'M316', // 정류장 번호
    //     zone: '경의중앙선',
    //     like: true,
    //   },
    //   {
    //     id: 2,
    //     label: 'M',
    //     name: '운정역',
    //     username: '경의중앙선',
    //     username_id: 'M317',
    //     zone: '경의중앙선',
    //     like: false,
    //   },
    // ],
    // '3호선': [
    //   {
    //     id: 3,
    //     label: 'M',
    //     name: '마두역',
    //     username: '3호선',
    //     username_id: 'M322', // 정류장 번호
    //     zone: '3호선',
    //     like: false,
    //   },
    //   {
    //     id: 4,
    //     label: 'M',
    //     name: '정발산역',
    //     username: '3호선',
    //     username_id: 'M324', // 정류장 번호
    //     zone: '3호선',
    //     like: false,
    //   },
    // ],
  };

  async search(name) {
    return this.metroList;
  }
}
