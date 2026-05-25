import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/institute';

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
  { timestamps: true },
);

const User = mongoose.model('User', UserSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB:', MONGODB_URI);

  const admins = [
    {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@uniadmit.com',
      password: 'Admin@2024',
      phone: '+1-000-000-0000',
      role: 'admin',
      status: 'active',
    },
  ];

  for (const admin of admins) {
    const exists = await User.findOne({ email: admin.email });
    if (exists) {
      console.log(`Admin already exists: ${admin.email} — skipping`);
      continue;
    }
    const hashed = await bcrypt.hash(admin.password, 10);
    await User.create({ ...admin, password: hashed });
    console.log(`Created admin: ${admin.email}`);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
