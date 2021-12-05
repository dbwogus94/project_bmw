export default class BusService {
  busList = {
    경기: [
      {
        id: 1, // 버스 번호
        label: 'B',
        name: '600',
        username: '야당과선교',
        username_id: '31652', // 정류장 번호
        server_time: '10:20', // 마지막으로 서버에서 가져온 시간
        first_time: '5 분전',
        first_text: '한빛마을 5단지 도착',
        second_time: '3 전',
        second_text: '해솔마을6.7단지 출발',
        direction: '서울 방면',
        routeTypeName: '파주시 일반버스',
        zone: '경기',
        like: true,
      },
      {
        id: 2,
        label: 'B',
        name: 'G7426',
        username: '야당과선교',
        username_id: '31652',
        server_time: '10:20',
        first_time: '6 분전',
        first_text: '한길육교',
        second_time: '',
        second_text: '도착정보 없음',
        direction: '서울 방면',
        routeTypeName: '경기도 광역버스',
        zone: '경기',
        like: false,
      },
    ],
    충청: [
      {
        id: 3,
        label: 'B',
        name: '600',
        username: 'xxx정류장',
        username_id: '34444', // 정류장 번호
        server_time: '10:20', // 마지막으로 서버에서 가져온 시간
        first_time: '5 분전',
        first_text: 'xxxx 5단지 도착',
        second_time: '3 전',
        second_text: 'xxxx 출발',
        direction: 'xx 방면',
        routeTypeName: '마을버스',
        zone: '충청',
        like: false,
      },
      {
        id: 4,
        label: 'B',
        name: '600-2',
        username: 'xxx정류장',
        username_id: '34445', // 정류장 번호
        server_time: '10:20', // 마지막으로 서버에서 가져온 시간
        first_time: '5 분전',
        first_text: 'xxxx 5단지 도착',
        second_time: '3 전',
        second_text: 'xxxx 출발',
        direction: 'xx 방면',
        routeTypeName: '간선버스',
        zone: '충청',
        like: false,
      },
    ],
  };

  async search(busName) {
    return this.busList;
  }
}
