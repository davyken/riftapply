import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true, lowercase: true },
    password: String,
    phone: String,
    role: { type: String, default: 'admin' },
    status: { type: String, default: 'active' },
  },
  { timestamps: true, collection: 'users' }
);

const User = mongoose.model('User', UserSchema);

async function testLogin() {
  console.log('Connecting to:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI as string);
  
  const email = 'admin@uniadmit.com';
  const password = 'Admin@2024';

  const user = await User.findOne({ email });
  if (!user) {
    console.log('User not found!');
    process.exit(1);
  }

  console.log('Found user:', user.email, 'Role:', user.role, 'Status:', user.status);

  const isValid = await bcrypt.compare(password, user.password as string);
  console.log('Password valid?', isValid);
  
  await mongoose.disconnect();
}

testLogin().catch(console.error);
