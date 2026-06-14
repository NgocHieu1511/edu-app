import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// 1. Cấu hình định danh Cloudinary bằng biến môi trường (Lấy từ file .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Cấu hình bộ lưu trữ thay thế hoàn toàn cho diskStorage cũ
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "edu_app_thumbnails", // Tên thư mục sẽ tự tạo trên tài khoản Cloudinary của bạn
    allowed_formats: ["jpg", "png", "jpeg", "webp"], // Các định dạng ảnh được phép upload
    public_id: (req, file) => {
      // Tách bỏ phần đuôi mở rộng của file gốc
      const nameWithoutExtension = file.originalname.split(".")[0];
      // Tạo tên file duy nhất bằng cách kết hợp mốc thời gian và tên gốc
      return `${Date.now()}-${nameWithoutExtension}`;
    },
  },
});

// 3. Khởi tạo middleware upload với storage mới
const upload = multer({
  storage,
});

export default upload;
