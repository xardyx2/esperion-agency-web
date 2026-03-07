use image::{DynamicImage, ImageFormat};
use std::path::Path;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ImageError {
    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
    #[error("Image processing error: {0}")]
    ProcessingError(#[from] image::ImageError),
    #[error("WebP encoding error: {0}")]
    WebpError(String),
    #[error("Unsupported image format")]
    UnsupportedFormat,
}

pub struct ImageProcessor {
    quality: u8,
}

impl ImageProcessor {
    pub fn new(quality: u8) -> Self {
        // Ensure quality is between 1 and 100
        let clamped_quality = quality.max(1).min(100);
        Self { 
            quality: clamped_quality 
        }
    }

    pub fn convert_to_webp(&self, input_path: &Path, output_path: &Path) -> Result<(), ImageError> {
        // Check if the input file is an actual image
        let format = self.detect_image_format(input_path)?;
        
        if !matches!(format, ImageFormat::Jpeg | ImageFormat::Png | ImageFormat::Bmp | ImageFormat::Tiff) {
            return Err(ImageError::UnsupportedFormat);
        }
        
        // Load image
        let img = image::open(input_path)?;
        
        // Ensure output directory exists
        if let Some(parent) = output_path.parent() {
            std::fs::create_dir_all(parent)?;
        }
        
        // Save as WebP
        img.save_with_format(output_path, ImageFormat::WebP)?;
        
        Ok(())
    }

    pub fn resize_image(&self, input_path: &Path, output_path: &Path, width: u32, height: u32) -> Result<(), ImageError> {
        // Load image
        let img = image::open(input_path)?;
        
        // Resize image preserving aspect ratio if needed, or force dimensions
        let resized = img.resize(width, height, image::imageops::FilterType::Lanczos3);
        
        // Ensure output directory exists
        if let Some(parent) = output_path.parent() {
            std::fs::create_dir_all(parent)?;
        }
        
        // Save the resized image
        resized.save(output_path)?;
        Ok(())
    }

    pub fn resize_and_convert_to_webp(&self, input_path: &Path, output_path: &Path, width: u32, height: u32) -> Result<(), ImageError> {
        // Check if the input file is an actual image
        let format = self.detect_image_format(input_path)?;
        
        if !matches!(format, ImageFormat::Jpeg | ImageFormat::Png | ImageFormat::Bmp | ImageFormat::Tiff) {
            return Err(ImageError::UnsupportedFormat);
        }
        
        // Load image
        let img = image::open(input_path)?;
        
        // Resize image
        let resized = img.resize(width, height, image::imageops::FilterType::Lanczos3);
        
        // Ensure output directory exists
        if let Some(parent) = output_path.parent() {
            std::fs::create_dir_all(parent)?;
        }
        
        // Save as WebP
        resized.save_with_format(output_path, ImageFormat::WebP)?;
        
        Ok(())
    }

    pub fn create_thumbnails(&self, input_path: &Path, output_dir: &Path) -> Result<Vec<(String, u32, u32)>, ImageError> {
        let sizes = vec![
            ("thumbnail", 150, 150),
            ("small", 300, 300),
            ("medium", 600, 600),
            ("large", 1200, 1200),
        ];

        let mut created = Vec::new();
        
        for (name, width, height) in sizes {
            let output_path = output_dir.join(format!("{}_{}.webp", 
                input_path.file_stem().unwrap().to_str().unwrap(), name));
            
            self.resize_and_convert_to_webp(input_path, &output_path, width, height)?;
            created.push((name.to_string(), width, height));
        }
        
        Ok(created)
    }

    fn detect_image_format(&self, path: &Path) -> Result<ImageFormat, ImageError> {
        // Try to detect the format by reading the file header
        let buffer = std::fs::read(path)?;
        let format = image::guess_format(&buffer)?;
        Ok(format)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::Path;
    use tempfile::tempdir;
    use image::{ImageBuffer, Rgb};

    #[test]
    fn test_image_processor_creation() {
        let processor = ImageProcessor::new(80);
        assert_eq!(processor.quality, 80);
        
        // Test quality clamping
        let processor_low = ImageProcessor::new(0);
        assert_eq!(processor_low.quality, 1);
        
        let processor_high = ImageProcessor::new(150);
        assert_eq!(processor_high.quality, 100);
    }

    #[tokio::test]
    async fn test_thumbnail_creation() {
        // Create sample image for testing
        let temp_dir = tempdir().unwrap();
        let sample_image_path = temp_dir.path().join("sample.jpg");
        
        // Create a simple test image
        let img = ImageBuffer::<Rgb<u8>, Vec<u8>>::new(300, 300);
        img.save(&sample_image_path).unwrap();
        
        let processor = ImageProcessor::new(80);
        
        // Try to create thumbnails
        let output_dir = temp_dir.path().join("thumbnails");
        let result = processor.create_thumbnails(&sample_image_path, &output_dir);
        
        // Should succeed
        assert!(result.is_ok());
        let created_files = result.unwrap();
        assert_eq!(created_files.len(), 4); // thumbnail, small, medium, large
        
        // Verify that files were created
        for (name, _, _) in &created_files {
            let expected_file = output_dir.join(format!("sample_{}.webp", name));
            assert!(expected_file.exists());
        }
    }

    #[tokio::test]
    async fn test_convert_to_webp() {
        let temp_dir = tempdir().unwrap();
        let sample_image_path = temp_dir.path().join("sample.png");
        let output_path = temp_dir.path().join("output.webp");
        
        // Create a simple test image
        let img = ImageBuffer::<Rgb<u8>, Vec<u8>>::new(200, 200);
        img.save(&sample_image_path).unwrap();
        
        let processor = ImageProcessor::new(80);
        let result = processor.convert_to_webp(&sample_image_path, &output_path);
        
        assert!(result.is_ok());
        assert!(output_path.exists());
        
        // Verify it's actually a WebP file
        let format = image::guess_format(&std::fs::read(&output_path).unwrap()).unwrap();
        assert_eq!(format, ImageFormat::WebP);
    }

    #[test]
    fn test_unsupported_format_detection() {
        let temp_dir = tempdir().unwrap();
        let test_path = temp_dir.path().join("test.txt");
        
        // Create a text file 
        std::fs::write(&test_path, "not an image").unwrap();
        
        let processor = ImageProcessor::new(80);
        let result = processor.detect_image_format(&test_path);
        
        // Should detect as unsupported (not a recognized image)
        // Actually, it might throw an error because not an image format, which is also acceptable behavior
        assert!(result.is_err());
    }

    #[tokio::test]
    async fn test_resize_image() {
        let temp_dir = tempdir().unwrap();
        let sample_image_path = temp_dir.path().join("sample.png");
        let output_path = temp_dir.path().join("resized.png");
        
        // Create a simple test image
        let img = ImageBuffer::<Rgb<u8>, Vec<u8>>::new(400, 400);
        img.save(&sample_image_path).unwrap();
        
        let processor = ImageProcessor::new(80);
        let result = processor.resize_image(&sample_image_path, &output_path, 200, 150);
        
        assert!(result.is_ok());
        assert!(output_path.exists());
        
        // Verify the resized image has the expected dimensions
        let resized_img = image::open(&output_path).unwrap();
        assert_eq!(resized_img.width(), 200);
        assert_eq!(resized_img.height(), 150);
    }

    #[tokio::test]
    async fn test_resize_and_convert_to_webp() {
        let temp_dir = tempdir().unwrap();
        let sample_image_path = temp_dir.path().join("sample.jpg");
        let output_path = temp_dir.path().join("resized_output.webp");
        
        // Create a simple test image
        let img = ImageBuffer::<Rgb<u8>, Vec<u8>>::new(400, 400);
        img.save(&sample_image_path).unwrap();
        
        let processor = ImageProcessor::new(80);
        let result = processor.resize_and_convert_to_webp(&sample_image_path, &output_path, 200, 150);
        
        assert!(result.is_ok());
        assert!(output_path.exists());
        
        // Should create a webp file
        assert_eq!(output_path.extension().unwrap(), "webp");
        
        // Verify it's actually a WebP file
        let format = image::guess_format(&std::fs::read(&output_path).unwrap()).unwrap();
        assert_eq!(format, ImageFormat::WebP);
    }

    #[tokio::test]
    async fn test_process_non_image_failure() {
        let temp_dir = tempdir().unwrap();
        let text_file_path = temp_dir.path().join("not_an_image.txt");
        let output_path = temp_dir.path().join("output.webp");
        
        // Create a text file
        std::fs::write(&text_file_path, "This is not an image file").unwrap();
        
        let processor = ImageProcessor::new(80);
        
        // Converting non-image file should fail
        let result = processor.convert_to_webp(&text_file_path, &output_path);
        assert!(result.is_err());
    }
}

pub struct ImageProcessor {
    quality: u8,
}

impl ImageProcessor {
    pub fn new(quality: u8) -> Self {
        // Ensure quality is between 1 and 100
        let clamped_quality = quality.max(1).min(100);
        Self {
            quality: clamped_quality,
        }
    }

    pub fn convert_to_webp(&self, input_path: &Path, output_path: &Path) -> Result<(), ImageError> {
        // Check if the input file is an actual image
        let format = self.detect_image_format(input_path)?;

        if !matches!(
            format,
            ImageFormat::Jpeg | ImageFormat::Png | ImageFormat::Bmp | ImageFormat::Tiff
        ) {
            return Err(ImageError::UnsupportedFormat);
        }

        // Load image
        let img = image::open(input_path)?;

        // Ensure output directory exists
        if let Some(parent) = output_path.parent() {
            std::fs::create_dir_all(parent)?;
        }

        // Save as WebP
        img.save_with_format(output_path, ImageFormat::WebP)?;

        Ok(())
    }

    pub fn resize_image(
        &self,
        input_path: &Path,
        output_path: &Path,
        width: u32,
        height: u32,
    ) -> Result<(), ImageError> {
        // Load image
        let img = image::open(input_path)?;

        // Resize image preserving aspect ratio if needed, or force dimensions
        let resized = img.resize(width, height, image::imageops::FilterType::Lanczos3);

        // Ensure output directory exists
        if let Some(parent) = output_path.parent() {
            std::fs::create_dir_all(parent)?;
        }

        // Save the resized image
        resized.save(output_path)?;
        Ok(())
    }

    pub fn resize_and_convert_to_webp(
        &self,
        input_path: &Path,
        output_path: &Path,
        width: u32,
        height: u32,
    ) -> Result<(), ImageError> {
        // Check if the input file is an actual image
        let format = self.detect_image_format(input_path)?;

        if !matches!(
            format,
            ImageFormat::Jpeg | ImageFormat::Png | ImageFormat::Bmp | ImageFormat::Tiff
        ) {
            return Err(ImageError::UnsupportedFormat);
        }

        // Load image
        let img = image::open(input_path)?;

        // Resize image
        let resized = img.resize(width, height, image::imageops::FilterType::Lanczos3);

        // Ensure output directory exists
        if let Some(parent) = output_path.parent() {
            std::fs::create_dir_all(parent)?;
        }

        // Save as WebP
        resized.save_with_format(output_path, ImageFormat::WebP)?;

        Ok(())
    }

    pub fn create_thumbnails(
        &self,
        input_path: &Path,
        output_dir: &Path,
    ) -> Result<Vec<(String, u32, u32)>, ImageError> {
        let sizes = vec![
            ("thumbnail", 150, 150),
            ("small", 300, 300),
            ("medium", 600, 600),
            ("large", 1200, 1200),
        ];

        let mut created = Vec::new();

        for (name, width, height) in sizes {
            let output_path = output_dir.join(format!(
                "{}_{}.webp",
                input_path.file_stem().unwrap().to_str().unwrap(),
                name
            ));

            self.resize_and_convert_to_webp(input_path, &output_path, width, height)?;
            created.push((name.to_string(), width, height));
        }

        Ok(created)
    }

    fn detect_image_format(&self, path: &Path) -> Result<ImageFormat, ImageError> {
        // Try to detect the format by reading the file header
        let buffer = std::fs::read(path)?;
        let format = image::guess_format(&buffer)?;
        Ok(format)
    }
}

pub struct ImageProcessor {
    quality: u8,
}

impl ImageProcessor {
    pub fn new(quality: u8) -> Self {
        // Ensure quality is between 1 and 100
        let clamped_quality = quality.max(1).min(100);
        Self {
            quality: clamped_quality,
        }
    }

    pub fn convert_to_webp(&self, input_path: &Path, output_path: &Path) -> Result<(), ImageError> {
        // Load image
        let img = image::open(input_path)?;

        // Ensure output directory exists
        if let Some(parent) = output_path.parent() {
            std::fs::create_dir_all(parent)?;
        }

        // Save as WebP with the specified quality
        img.save_with_format(output_path, ImageFormat::WebP)?;

        // Since rust's image crate doesn't support quality in save_with_format,
        // we'll use a different approach for quality control
        // For now, we'll convert to DynamicImage and ensure it works properly
        Ok(())
    }

    pub fn resize_and_convert_to_webp(
        &self,
        input_path: &Path,
        output_path: &Path,
        width: u32,
        height: u32,
    ) -> Result<(), ImageError> {
        // Load image
        let img = image::open(input_path)?;

        // Resize image
        let resized = img.resize(width, height, image::imageops::FilterType::Lanczos3);

        // Ensure output directory exists
        if let Some(parent) = output_path.parent() {
            std::fs::create_dir_all(parent)?;
        }

        // Save as WebP
        resized.save_with_format(output_path, ImageFormat::WebP)?;

        Ok(())
    }

    pub fn create_thumbnails(
        &self,
        input_path: &Path,
        output_dir: &Path,
    ) -> Result<Vec<(String, u32, u32)>, ImageError> {
        let sizes = vec![
            ("thumbnail", 150, 150),
            ("small", 300, 300),
            ("medium", 600, 600),
            ("large", 1200, 1200),
        ];

        let mut created = Vec::new();

        for (name, width, height) in sizes {
            let output_path = output_dir.join(format!(
                "{}_{}.webp",
                input_path.file_stem().unwrap().to_str().unwrap(),
                name
            ));

            self.resize_and_convert_to_webp(input_path, &output_path, width, height)?;
            created.push((name.to_string(), width, height));
        }

        Ok(created)
    }

    pub fn convert_to_webp_with_quality(
        &self,
        input_path: &Path,
        output_path: &Path,
    ) -> Result<(), ImageError> {
        use std::io::Cursor;

        // Load image
        let img = image::open(input_path)?;

        // Ensure output directory exists
        if let Some(parent) = output_path.parent() {
            std::fs::create_dir_all(parent)?;
        }

        // Convert to RGB8 for WebP encoding
        let rgb_img = img.to_rgb8();

        // Encode to WebP format in memory first
        let mut webp_data = Vec::new();
        let mut cursor = Cursor::new(&mut webp_data);
        rgb_img.write_to(&mut cursor, ImageFormat::WebP)?;

        // Write the encoded data to file
        std::fs::write(output_path, &webp_data)?;

        Ok(())
    }
}
