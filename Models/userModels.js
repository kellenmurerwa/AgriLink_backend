import Joi from 'joi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['Farmer', 'Buyer', 'Agronomist'], default: 'Buyer' }
}, { timestamps: true });

// Remove password from JSON responses
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

// Generate authentication token
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user.id.toString(), role: user.role, firstName:user.firstName, lastName:user.lastName }, process.env.JWT_SECRET);
    return token;
};

// Hash password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// Find user by credentials (email & password)
userSchema.statics.findByCredentials = async function (email, password) { // Fixed `this` issue
    const user = await this.findOne({ email });
    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
};

// Validate user input using Joi
export const validateData = (data, action) => { // Fixed `export`
    const schema = action === 'login' ? Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }) : Joi.object({
        firstName: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().valid('farmer', 'buyer', 'agronomist').required()
    });

    return schema.validate(data);
};

// Create User model
const User = mongoose.model('User', userSchema);
export default User;
