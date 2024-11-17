import multer from "multer";

// Multer setup for in-memory file uploads
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

export default upload;
