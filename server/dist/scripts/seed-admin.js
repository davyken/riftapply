"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const bcrypt = __importStar(require("bcrypt"));
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/institute';
const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true, lowercase: true },
    password: String,
    phone: String,
    role: { type: String, default: 'admin' },
    status: { type: String, default: 'active' },
}, { timestamps: true });
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
//# sourceMappingURL=seed-admin.js.map