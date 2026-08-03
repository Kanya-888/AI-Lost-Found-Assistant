import os
import uuid
from PIL import Image
import cv2
import numpy as np
from fastapi import UploadFile, HTTPException
from backend.config import settings

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

def validate_and_save_image(file: UploadFile) -> str:
    """
    Validate uploaded image file, process/resize using Pillow & OpenCV,
    and save to local upload directory. Returns stored relative file path.
    """
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image extension '{ext}'. Allowed extensions: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Read uploaded file content
    contents = file.file.read()
    if len(contents) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="Image size exceeds 10MB limit")

    unique_filename = f"{uuid.uuid4().hex}{ext}"
    target_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    try:
        # Decode image using OpenCV for noise reduction / standard color conversion
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Corrupt image data")

        # Convert BGR to RGB
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Resize image if larger than 1024x1024 while maintaining aspect ratio
        pil_img = Image.fromarray(img_rgb)
        pil_img.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
        
        # Save optimized image
        pil_img.save(target_path, quality=85, optimize=True)
        return f"/uploads/{unique_filename}"
    except Exception as e:
        # Fallback to direct raw save if OpenCV/PIL processing encounters non-standard metadata
        with open(target_path, "wb") as f:
            f.write(contents)
        return f"/uploads/{unique_filename}"
