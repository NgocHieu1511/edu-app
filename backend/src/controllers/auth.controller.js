import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const DEMO_ACCOUNT = {
  name: "Hieu",
  email: "hieu123@gmail.com",
  password: "123456",
  role: "user",
};

const sanitizeUser = (user) => {
  const userObject = user.toObject ? user.toObject() : user;
  const { password, ...safeUser } = userObject;
  return safeUser;
};

const getDemoUser = () => ({
  _id: "demo-user",
  name: DEMO_ACCOUNT.name,
  email: normalizeEmail(DEMO_ACCOUNT.email),
  password: bcrypt.hashSync(DEMO_ACCOUNT.password, 10),
  role: DEMO_ACCOUNT.role,
});

const ensureDemoAccount = async () => {
  const email = normalizeEmail(DEMO_ACCOUNT.email);

  try {
    let user = await User.findOne({ email });

    if (!user) {
      const hashedPassword = await bcrypt.hash(DEMO_ACCOUNT.password, 10);
      user = await User.create({
        name: DEMO_ACCOUNT.name,
        email,
        password: hashedPassword,
        role: DEMO_ACCOUNT.role,
      });
    }

    return user;
  } catch {
    return getDemoUser();
  }
};

export const register = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Register successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    let user = null;

    try {
      user = await User.findOne({ email });
    } catch {
      user = null;
    }

    if (!user && email === normalizeEmail(DEMO_ACCOUNT.email)) {
      user = await ensureDemoAccount();
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
