export class CreateUserWithIdDto {
  public id!: string;
  public email!: string;
  public avatarUrl?: string;
  public name!: string;
  public isPro!: boolean;
  public password!: string;
}
