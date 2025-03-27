import User from "../Models/userModels.js";
import sendEmail from "../utils/sendemail.js";
export const Register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Create user (password is automatically hashed in model)
        const user = new User({ firstName, lastName, email, password, role });

        // Generate authentication token using the model method
        const accessToken = await user.generateAuthToken();

        // Save user
        await user.save();

        ///=========================================================//
        const htmlContent = `
<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
  <h2 style="color: #1E88E5;">Welcome to AgriLink Rwanda!</h2>
  <p>Hello ${firstName},</p>
  <p>Thank you for registering with AgriLink Rwanda. Your account has been successfully created and you now have access to our Agriculture platform.</p>
  
  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #dee2e6;">
    <p><strong>Your account details:</strong></p>
    <p>Email: ${email}</p>
    <p>Password: ${password}</p>
    <p>Role: ${role}</p>
  </div>
    
  <p>Log in to your account now to start managing your Agriculture journey.</p>
  
  <div style="margin-top: 30px; padding: 10px 0; border-top: 1px solid #eee;">
    <p>Best Regards,<br>AgriLink Rwanda Team</p>
  </div>
</div>
`;

// Send confirmation email
const subject = "Welcome to AgriLink Rwanda - Your Agriculture Journey Begins";
const emailSent = await sendEmail(email, subject, htmlContent);
    
    console.log("User created successfully:", user);

        ///========================================================//



        res.status(201).json({
            message: "Account created successfully!",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                accessToken  
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to register user", error: error.message });
    }
};

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user and validate credentials using model method
        const user = await User.findByCredentials(email, password);

        // Generate a new authentication token
        const accessToken = await user.generateAuthToken();

        res.json({
            message: "Login successful!",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                accessToken  
            },
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid email or password" });
    }
};

export const getAllUsers=async(req,res)=>
{
    try{
    const AllUsers=await User.find();
    if(AllUsers)
    {
    return res.status(200).json({
        size:AllUsers.length,
      AllUsers  
    })}
}
    catch(error)
    {
        res.status(500).json("Internal server error",error)
    }
}
