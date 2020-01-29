import { UserModel } from '../models/user.model';

export interface AuthInterface {
	signup(user: UserModel);
	login(user: UserModel);
	logout();
}
