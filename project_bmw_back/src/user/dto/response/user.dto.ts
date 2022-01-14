export class UserDto {
  accessToken!: string;
  username!: string;

  constructor(data: any) {
    const { accessToken, username } = data;
    this.accessToken = accessToken;
    this.username = username;
  }
}
