import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using Environment Variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true // Ensures HTTPS is used
});

// Quick test function to verify connection
async function testConnection() {
  try {
    const result = await cloudinary.api.ping();
    console.log("Cloudinary Connection Successful:", result);
  } catch (error) {
    console.error("Cloudinary Connection Failed:", error);
  }
}

export default cloudinary;