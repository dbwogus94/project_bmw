export default class TweetService {
  tweets = [
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
      bmGroupId: '10',
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
      bmGroupId: '10',
      like: true,
    },
    {
      id: 3,
      label: 'M',
      name: '야당역',
      username: '경의중앙선',
      username_id: '??',
      server_time: '10:20',
      first_time: '10 분전',
      first_text: '금촌 출발',
      second_time: '5 전',
      second_text: '월롱 도착',
      direction: '서울 방면',
      routeTypeName: '',
      bmGroupId: '20',
      like: true,
    },
    {
      id: 4,
      label: 'M',
      name: '운정역',
      username: '경의중앙선',
      username_id: '??',
      server_time: '10:20',
      first_time: '10 분전',
      first_text: '금촌 출발',
      second_time: '5 전',
      second_text: '월롱 도착',
      direction: '서울 방면',
      routeTypeName: '',
      bmGroupId: '10',
      like: true,
    },
  ];

  bmGroup = [
    {
      userId: '1',
      username: 'jay',
      bmGroupId: '10',
      bmGroupName: '출근',
    },
    {
      userId: '1',
      username: 'jay',
      bmGroupId: '20',
      bmGroupName: '퇴근',
    },
    {
      userId: '1',
      username: 'jay',
      bmGroupId: '30',
      bmGroupName: '우리집',
    },
  ];

  // 서버에서 도착정보가 가장 빠른 순으로 데이터가 와야함
  //bmlist = [...this.tweets];
  // 버스, 지하철로 데이터가 묶여서 들어와야한다.
  //bmGroup = {bus: [], metro: []};

  async getTweets(username) {
    return username ? this.tweets.filter(tweet => tweet.username === username) : this.tweets;
  }

  // 유저의 전체 그룹 리스트
  async getBMGroupList(username) {
    return this.bmGroup;
  }

  //
  /**
   *  bmGroupId에 해당하는 BMGroup 조회
   * 서버에서 전달받아야 하는 데이터 형태
   * @param {*} bmGroupId
   * @returns { bus: [], metro: [] }
   */
  async getBMGroup(bmGroupId) {
    const bmList = this.tweets.filter(tweet => tweet.bmGroupId === bmGroupId);
    const bus = bmList.filter(bm => bm.label === 'B');
    const metro = bmList.filter(bm => bm.label === 'M');
    return !!(bus.length || metro.length) //
      ? { bus, metro }
      : {};
  }

  /**
   * 전달받은 bmGroupId에 속하는 BMList 조회
   * -> 서버에서 도착시간이 빠른순 정렬하여 전달받아야 한다.
   * @param {*} bmGroupId
   * @returns list
   */
  async getBMList(bmGroupId) {
    return this.tweets.filter(tweet => tweet.bmGroupId === bmGroupId);
  }
}
