import multer from "multer";

// Configure multer to use memory storage for Cloudinary uploads
const storage = multer.memoryStorage();

// Log the storage configuration
console.log("Multer storage configuration:", {
  storageType: storage.constructor.name
});

export const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    console.log("Processing file:", {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      console.log("File accepted:", file.originalname);
      cb(null, true);
    } else {
      console.error("File rejected - not an image:", file.originalname);
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Add a function to log the request details
export const logRequest = (req: any, res: any, next: any) => {
  console.log("Request headers:", req.headers);
  console.log("Request body:", req.body);
  console.log("Request files:", req.files);
  next();
};
