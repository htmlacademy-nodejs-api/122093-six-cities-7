export class CreateUserDto {
  public name: string;
  public email: string;
  public avatarUrl?: string;
  public isPro: boolean;
  public password: string;
}
