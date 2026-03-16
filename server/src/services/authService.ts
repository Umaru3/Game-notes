import bcrypt from 'bcrypt';
import { Collection, ObjectId } from 'mongodb';

export interface UserItem {
  _id?: ObjectId;
  username: string;
  email: string;
  passwordHash: string;
}

export class AuthService {
  constructor(private users: Collection<UserItem>) {}

  async register(username: string, email: string, password: string) {
    const existing = await this.users.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      throw new Error('Username or email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await this.users.insertOne({ username, email, passwordHash });
    return { _id: result.insertedId, username, email }; 
  }

  async login(usernameOrEmail: string, password: string) {
    const user = await this.users.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return { _id: user._id, username: user.username, email: user.email };
  }
}
