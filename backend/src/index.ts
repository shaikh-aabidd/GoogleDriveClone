import dotenv from "dotenv";
import { connectDB } from "./db/index";
import { app } from "./app";

dotenv.config({
  path: ".env"
});

const port: string | number = process.env.PORT || 8000;



const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    
    app.listen(port, () => {
      console.log(`🚀 Google Drive Clone server is running at port ${port}`);
      console.log(`📧 Email service: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`);
      console.log(`🗄️  Database: Supabase connected`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
