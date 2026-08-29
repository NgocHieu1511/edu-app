import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, callback) => {
    const extension = file.originalname.split(".").pop();
    callback(null, `blog-${Date.now()}.${extension}`);
  },
});

const uploadBlogImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
      return;
    }
    callback(new Error("Ảnh bài viết không hợp lệ"));
  },
});

export default uploadBlogImage;
