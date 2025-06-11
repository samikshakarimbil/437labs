import { Request, Response, NextFunction } from "express";
import multer from "multer";

class ImageFormatError extends Error {}

const storageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = process.env.IMAGE_UPLOAD_DIR || "uploads"; // fallback to uploads
        cb(null, uploadDir);
    },
    
    filename: function (req, file, cb) {
        let extension = "";
        switch (file.mimetype) {
            case "image/png":
                extension = "png";
                break;
            case "image/jpg":
            case "image/jpeg":
                extension = "jpg";
                break;
            default:
                return cb(new ImageFormatError("Unsupported image type"), "");
        }
    
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;
        cb(null, fileName);
    },
    
});

export const imageMiddlewareFactory = multer({
    storage: storageEngine,
    limits: {
        files: 1,
        fileSize: 5 * 1024 * 1024 // 5 MB
    },
});

export function handleImageFileErrors(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof multer.MulterError || err instanceof ImageFormatError) {
        res.status(400).send({
            error: "Bad Request",
            message: err.message
        });
        return;
    }
    next(err); 
}