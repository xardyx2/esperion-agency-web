use std::path::Path;
use tempfile::tempdir;
use crate::services::image_processor::{ImageProcessor, ImageError};

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
    let img = image::ImageBuffer::<image::Rgb<u8>, Vec<u8>>::new(300, 300);
    img.save(&sample_image_path).unwrap();
    
    let processor = ImageProcessor::new(80);
    
    // Try to create thumbnails
    let output_dir = temp_dir.path().join("thumbnails");
    let result = processor.create_thumbnails(&sample_image_path, &output_dir);
    
    // Should succeed
    assert!(result.is_ok());
    let created_files = result.unwrap();
    assert_eq!(created_files.len(), 4); // thumbnail, small, medium, large
}

#[tokio::test]
async fn test_convert_to_webp() {
    let temp_dir = tempdir().unwrap();
    let sample_image_path = temp_dir.path().join("sample.png");
    let output_path = temp_dir.path().join("output.webp");
    
    // Create a simple test image
    let img = image::ImageBuffer::<image::Rgb<u8>, Vec<u8>>::new(200, 200);
    img.save(&sample_image_path).unwrap();
    
    let processor = ImageProcessor::new(80);
    let result = processor.convert_to_webp(&sample_image_path, &output_path);
    
    assert!(result.is_ok());
    assert!(output_path.exists());
}

#[test]
fn test_unsupported_format_detection() {
    let processor = ImageProcessor::new(80);
    
    // Should return unsupported format for non-image files
    let test_path = Path::new("test.txt");
    std::fs::write(test_path, "not an image").unwrap();
    
    // Cleanup test file
    let _ = std::fs::remove_file(test_path);
}

#[tokio::test]
async fn test_resize_image() {
    let temp_dir = tempdir().unwrap();
    let sample_image_path = temp_dir.path().join("sample.png");
    let output_path = temp_dir.path().join("resized.png");
    
    // Create a simple test image
    let img = image::ImageBuffer::<image::Rgb<u8>, Vec<u8>>::new(400, 400);
    img.save(&sample_image_path).unwrap();
    
    let processor = ImageProcessor::new(80);
    let result = processor.resize_image(&sample_image_path, &output_path, 200, 150);
    
    assert!(result.is_ok());
    assert!(output_path.exists());
    
    // Verify the resized image has approximately the right dimensions
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
    let img = image::ImageBuffer::<image::Rgb<u8>, Vec<u8>>::new(400, 400);
    img.save(&sample_image_path).unwrap();
    
    let processor = ImageProcessor::new(80);
    let result = processor.resize_and_convert_to_webp(&sample_image_path, &output_path, 200, 150);
    
    assert!(result.is_ok());
    assert!(output_path.exists());
    
    // Should create a webp file
    assert!(output_path.extension().unwrap() == "webp");
}