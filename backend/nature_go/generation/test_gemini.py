"""
Test script for Gemini image generation.

Run with: python -m generation.test_gemini

Requires GOOGLE_API_KEY environment variable to be set.
"""
import os
import sys
from io import BytesIO


def test_generate_image():
    """Test that generate_image returns valid PNG bytes."""
    from generation.gemini import generate_image
    
    prompt = "A simple botanical illustration of a red rose on white background"
    print(f"Testing image generation with prompt: {prompt[:50]}...")
    
    image_bytes = generate_image(prompt)
    
    if image_bytes is None:
        print("FAIL: generate_image returned None")
        return False
    
    print(f"Received {len(image_bytes)} bytes")
    
    # Check PNG magic bytes
    png_header = b'\x89PNG\r\n\x1a\n'
    jpeg_header = b'\xff\xd8\xff'
    
    if image_bytes[:8] == png_header:
        print("OK: Image has valid PNG header")
    elif image_bytes[:3] == jpeg_header:
        print("FAIL: Image has JPEG header (expected PNG)")
        return False
    else:
        print(f"FAIL: Unknown image format. First 16 bytes: {image_bytes[:16].hex()}")
        return False
    
    # Try to open with PIL
    from PIL import Image
    try:
        img = Image.open(BytesIO(image_bytes))
        print(f"OK: PIL can open image. Format: {img.format}, Size: {img.size}, Mode: {img.mode}")
    except Exception as e:
        print(f"FAIL: PIL cannot open image: {e}")
        return False
    
    # Save to test file
    test_path = "/tmp/test_generated_image.png"
    with open(test_path, "wb") as f:
        f.write(image_bytes)
    print(f"Saved test image to {test_path}")
    
    # Verify the saved file
    try:
        img2 = Image.open(test_path)
        print(f"OK: PIL can open saved file. Format: {img2.format}")
    except Exception as e:
        print(f"FAIL: PIL cannot open saved file: {e}")
        return False
    
    print("\nAll tests passed!")
    return True


def test_imagen_direct():
    """Test Imagen API directly without any wrapper."""
    from google import genai
    
    print("\nTesting Imagen API directly...")
    
    client = genai.Client()
    
    response = client.models.generate_images(
        model="models/imagen-4.0-generate-001",
        prompt="A simple red circle on white background",
        config=dict(
            number_of_images=1,
            output_mime_type="image/png",
            aspect_ratio="1:1",
        ),
    )
    
    if not response.generated_images:
        print("FAIL: No images generated")
        return False
    
    image = response.generated_images[0].image
    if not image or not image.image_bytes:
        print("FAIL: No image bytes")
        return False
    
    image_bytes = image.image_bytes
    print(f"Received {len(image_bytes)} bytes")
    print(f"First 16 bytes (hex): {image_bytes[:16].hex()}")
    
    # Check header
    if image_bytes[:8] == b'\x89PNG\r\n\x1a\n':
        print("OK: Valid PNG header")
    elif image_bytes[:3] == b'\xff\xd8\xff':
        print("WARNING: JPEG header detected (API ignoring output_mime_type?)")
    else:
        print("WARNING: Unknown format")
    
    # Check if actually base64 encoded
    if image_bytes[:4] == b'iVBO':  # Base64 PNG starts with this
        print("WARNING: Data appears to be base64 encoded!")
        import base64
        decoded = base64.b64decode(image_bytes)
        print(f"Decoded first 16 bytes: {decoded[:16].hex()}")
    
    return True


if __name__ == "__main__":
    if not os.environ.get("GOOGLE_API_KEY"):
        print("Error: GOOGLE_API_KEY environment variable not set")
        sys.exit(1)
    
    # Add parent dir to path for imports
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    print("=" * 60)
    print("Gemini Image Generation Test")
    print("=" * 60)
    
    success = test_imagen_direct()
    if success:
        success = test_generate_image()
    
    sys.exit(0 if success else 1)
