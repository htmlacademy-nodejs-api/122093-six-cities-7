export class CreateUserDto {
  public email!: string;
  public avatarUrl?: string;
  public name!: string;
  public isPro!: boolean;
  public password!: string;
}
