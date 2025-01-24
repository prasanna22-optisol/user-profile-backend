import {mongoose} from "mongoose"


const userSchema = new mongoose.Schema({
    password: { type: String, required: [true, "Password is required"] },
    email: { type: String, required: [true, "Email is required"], unique: true },
    fullName: { type: String, required: [true, "Full name is required"] },
    mobileNumber: { type: String, required: [true, "Mobile number is required"] },
    designation: { type: String, required: [true, "Designation is required"] },
  }, {
    timestamps: true
  });
  
  // Prevent required validation during updates
  userSchema.pre('findOneAndUpdate', function (next) {
    this.options.runValidators = false; // Ensure validation only on updated fields
    next();
  });
  
  const User = mongoose.model('User', userSchema);
  
  export default User;
  