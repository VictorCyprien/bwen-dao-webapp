/**
 * File Utilities
 * Contains helper functions for file operations
 */

/**
 * Convert a File to a FileStorage-like object for Minio
 * Used for uploading files to the backend API
 */
export async function fileToMinioStorage(file: File): Promise<any> {
  // Convert file to base64 string
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64Data = window.btoa(binary);
  
  // Create a FileStorage-like object with all the required attributes
  return {
    name: file.name,
    filename: file.name,
    content_type: file.type,
    content_length: file.size,
    headers: {},
    stream: base64Data, // Send as base64 encoded string
  };
}

/**
 * Validate an uploaded image file
 * @param file The file to validate
 * @param maxSizeInMB Maximum allowed file size in MB (default: 5MB)
 * @returns An error message if validation fails, or null if validation passes
 */
export function validateImageFile(file: File, maxSizeInMB: number = 5): string | null {
  // Validate file type
  if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
    return 'Please upload an image file (JPEG, PNG, GIF)';
  }

  // Validate file size
  if (file.size > maxSizeInMB * 1024 * 1024) {
    return `Image file size must be less than ${maxSizeInMB}MB`;
  }

  return null;
} 