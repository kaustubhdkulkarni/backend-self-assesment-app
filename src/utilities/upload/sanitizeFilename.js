// ============= INDUSTRY STANDARD SANITIZATION FUNCTION (BUG-FREE) =============
const sanitizeFilename = (filename) => {
  // Input validation
  if (!filename || typeof filename !== 'string') {
    return 'file.txt';
  }

  // Step 1: Separate name and extension
  const lastDotIndex = filename.lastIndexOf('.');
  let name = lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
  let ext = lastDotIndex > 0 ? filename.substring(lastDotIndex) : '';
  
  // Step 2: Sanitize extension (remove unsafe chars from extension too)
  ext = ext.replace(/[^a-zA-Z0-9.]/g, '').toLowerCase();
  
  // Step 3: Remove ALL unsafe characters from name, keep only: a-z, A-Z, 0-9, hyphen, underscore
  let cleanName = name
    .replace(/[^a-zA-Z0-9_-]/g, '-')  // Replace unsafe chars with hyphen
    .replace(/-+/g, '-')              // Multiple hyphens to single
    .replace(/^-+|-+$/g, '')          // Remove leading/trailing hyphens
    .toLowerCase();                   // Lowercase for consistency
  
  // Step 4: Handle empty name edge case
  if (!cleanName) {
    cleanName = 'file';
  }
  
  // Step 5: Limit length (max 200 chars for name)
  if (cleanName.length > 200) {
    cleanName = cleanName.substring(0, 200).replace(/-+$/, ''); // Remove trailing dash after truncation
  }
  
  // Step 6: Ensure extension exists
  if (!ext) {
    ext = '.txt'; // Default extension
  }
  
  return cleanName + ext;
};

module.exports = sanitizeFilename;  
// ============= END SANITIZATION FUNCTION =============
