/**
 * Converts a relative image path to a full URL by prepending the API base URL
 * @param imagePath - The relative image path (e.g., "uploads/image.jpg") or full URL
 * @returns Full URL or null if imagePath is null/undefined
 */
export function getFullImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Otherwise, prepend the API base URL
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  return `${baseUrl}${imagePath}`;
}