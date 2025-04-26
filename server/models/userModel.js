import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    publicKey: {
      type: String,
      default: '',
    },
    digitalIdentity: {
      verified: {
        type: Boolean,
        default: false,
      },
      idType: {
        type: String,
        enum: ['government_id', 'passport', 'drivers_license', 'other', ''],
        default: '',
      },
      idNumber: {
        type: String,
        default: '',
      },
      verificationDate: {
        type: Date,
      },
    },
    contracts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
