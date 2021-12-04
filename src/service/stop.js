export default class StopService {
  stopList = {
    경기: [
      {
        id: 1, // 버스 번호
        label: 'S',
        name: '야당과선교',
        username: '31652 | 한빛마을 5단지 방면',
        username_id: '31652', // 정류장 번호
        zone: '경기',
      },
      {
        id: 2,
        label: 'S',
        name: '한길육교',
        username: '31677 | 야당역 방면',
        username_id: '31677',
        zone: '경기',
        like: false,
      },
    ],
    충청: [
      {
        id: 3,
        label: 'S',
        name: 'xxx정류장',
        username: '36534 | xxx아파트 방면',
        username_id: '36534', // 정류장 번호
        zone: '충청',
        like: false,
      },
    ],
  };

  async search(name) {
    return this.stopList;
  }
}
