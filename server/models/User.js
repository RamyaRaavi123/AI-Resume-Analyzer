const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    skills: [String],
    interests: [String],
    targetRole: { type: String, default: '' },
    targetCompanies: [String],
    avatar: { type: String, default: '' },
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    interviewReadiness: { type: Number, default: 0 },
    savedSessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSession' }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
