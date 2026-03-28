
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = 3000;

// Admin Role Persistence
const ADMINS_FILE = path.join(process.cwd(), "admins.json");
const getAdmins = (): string[] => {
  try {
    if (fs.existsSync(ADMINS_FILE)) {
      return JSON.parse(fs.readFileSync(ADMINS_FILE, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading admins file", e);
  }
  return ["admin@test.com"];
};

const saveAdmins = (admins: string[]) => {
  try {
    fs.writeFileSync(ADMINS_FILE, JSON.stringify(admins, null, 2));
  } catch (e) {
    console.error("Error saving admins file", e);
  }
};

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

app.use(cors());
app.use(express.json());

// Middleware for JWT Verification
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
};

// Middleware for Admin Check
const requireAdmin = (req: any, res: any, next: any) => {
  // We treat the specific user email as the default admin OR if the user has isAdmin flag
  const ADMIN_EMAIL = "admin@test.com";
  if (req.user.email !== ADMIN_EMAIL && !req.user.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// --- API ROUTES ---

// 2. Basic Auth: Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: user, error } = await supabase
      .from("auth_user")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      // Special case for the requested admin account if not in DB
      if (email === "admin@test.com" && password === "admin@123") {
        const token = jwt.sign({ id: "admin-id", email: "admin@test.com" }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ token, user: { id: "admin-id", email: "admin@test.com", first_name: "Admin", last_name: "User", isAdmin: true } });
      }
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      // Special case for admin password if email matches but password in DB is different
      if (email === "admin@test.com" && password === "admin@123") {
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ token, user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, isAdmin: true } });
      }
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const admins = getAdmins();
    const isAdmin = admins.includes(user.email) || user.email === "admin@test.com";
    const token = jwt.sign({ id: user.id, email: user.email, isAdmin }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, isAdmin } });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 6. Single POST API to push data into both tables (Register/Add Teacher)
app.post("/api/teachers", async (req, res) => {
  const { email, first_name, last_name, password, university_name, gender, year_joined } = req.body;

  try {
    // 1. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Insert into auth_user
    const { data: userData, error: userError } = await supabase
      .from("auth_user")
      .insert([{ email, first_name, last_name, password: hashedPassword }])
      .select()
      .single();

    if (userError) throw userError;

    // 3. Insert into teachers
    const { data: teacherData, error: teacherError } = await supabase
      .from("teachers")
      .insert([{ 
        user_id: userData.id, 
        university_name, 
        gender, 
        year_joined: parseInt(year_joined) 
      }])
      .select()
      .single();

    if (teacherError) throw teacherError;

    res.status(201).json({ user: userData, teacher: teacherData });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message || "Failed to create teacher" });
  }
});

// 7. APIs for Datatables
app.get("/api/me", authenticateToken, async (req: any, res) => {
  const { data, error } = await supabase
    .from("auth_user")
    .select("*, teachers(*)")
    .eq("id", req.user.id)
    .single();
  
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.get("/api/users", authenticateToken, requireAdmin, async (req, res) => {
  const { data, error } = await supabase.from("auth_user").select("id, email, first_name, last_name, created_at");
  if (error) return res.status(400).json({ error: error.message });
  
  const admins = getAdmins();
  const usersWithAdminStatus = data.map(u => ({
    ...u,
    is_admin: admins.includes(u.email) || u.email === "admin@test.com"
  }));
  
  res.json(usersWithAdminStatus);
});

app.get("/api/teachers", authenticateToken, async (req, res) => {
  const { data, error } = await supabase
    .from("teachers")
    .select("*, auth_user(email, first_name, last_name)");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Admin Delete APIs
app.delete("/api/users/:id", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to delete user with ID: ${id}`);
  
  // Delete from teachers first due to FK
  const { error: teacherError } = await supabase.from("teachers").delete().eq("user_id", id);
  if (teacherError) {
    console.error(`Error deleting teacher record for user ${id}:`, teacherError);
    return res.status(400).json({ error: teacherError.message });
  }
  
  const { error } = await supabase.from("auth_user").delete().eq("id", id);
  if (error) {
    console.error(`Error deleting auth_user ${id}:`, error);
    return res.status(400).json({ error: error.message });
  }
  
  console.log(`User ${id} deleted successfully`);
  res.json({ message: "User deleted successfully" });
});

app.delete("/api/teachers/:id", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to delete teacher with ID: ${id}`);
  
  // Get user_id first to delete from auth_user too
  const { data: teacher, error: fetchError } = await supabase.from("teachers").select("user_id").eq("id", id).single();
  if (fetchError) {
    console.error(`Error fetching teacher ${id}:`, fetchError);
    return res.status(400).json({ error: fetchError.message });
  }

  const userId = teacher.user_id;
  
  // Delete from teachers first
  const { error } = await supabase.from("teachers").delete().eq("id", id);
  if (error) {
    console.error(`Error deleting teacher ${id}:`, error);
    return res.status(400).json({ error: error.message });
  }
  
  // Now delete from auth_user
  const { error: userError } = await supabase.from("auth_user").delete().eq("id", userId);
  if (userError) {
    console.error(`Error deleting auth_user ${userId} for teacher ${id}:`, userError);
    // Not returning error here as teacher is already deleted, but logging it
  }
  
  console.log(`Teacher ${id} and associated user ${userId} deleted successfully`);
  res.json({ message: "Teacher record and associated user deleted successfully" });
});

// Admin Promote API
app.patch("/api/users/:id/admin", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { isAdmin } = req.body;
  
  // Get user email first
  const { data: user, error: fetchError } = await supabase.from("auth_user").select("email").eq("id", id).single();
  if (fetchError || !user) return res.status(400).json({ error: fetchError?.message || "User not found" });
  
  const admins = getAdmins();
  const email = user.email;
  
  if (isAdmin && !admins.includes(email)) {
    admins.push(email);
  } else if (!isAdmin && admins.includes(email)) {
    // Master admin cannot be demoted
    if (email === "admin@test.com") {
      return res.status(400).json({ error: "Master admin cannot be demoted" });
    }
    const index = admins.indexOf(email);
    admins.splice(index, 1);
  }
  
  saveAdmins(admins);
  res.json({ message: `User admin status updated to ${isAdmin}` });
});

// Admin Stats API
app.get("/api/admin/stats", authenticateToken, requireAdmin, async (req, res) => {
  const { count: userCount } = await supabase.from("auth_user").select("*", { count: 'exact', head: true });
  const { count: teacherCount } = await supabase.from("teachers").select("*", { count: 'exact', head: true });
  
  res.json({
    totalUsers: userCount || 0,
    totalTeachers: teacherCount || 0,
    systemStatus: "Operational",
    lastUpdate: new Date().toISOString()
  });
});

// --- VITE MIDDLEWARE ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
