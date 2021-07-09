export class User {
  public role = 'Customer';
  constructor(public name:string, public password: string, public money: number, role?: string, ){
    if (role) {
      this.role = role;
    }
}
}