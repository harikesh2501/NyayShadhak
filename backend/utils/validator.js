
/**
 * Validates user input to prevent malicious or inappropriate content
 * @param {string} input - User input to validate
 * @returns {boolean} - True if input is valid, false otherwise
 */
function validateInput(input) {
  // Check if input exists
  if (!input || typeof input !== 'string') {
    return false;
  }
  
  // Check if input is not just whitespace
  if (input.trim() === '') {
    return false;
  }
  
  // Check if input is not too long (prevent DoS attacks)
  if (input.length > 2000) {
    return false;
  }
  
  // Check for obviously malicious content
  const maliciousPatterns = [
    /<script>/i,
    /javascript:/i,
    /exec\s*\(/i,
    /system\s*\(/i,
    /eval\s*\(/i,
    /document\.cookie/i
  ];
  
  for (const pattern of maliciousPatterns) {
    if (pattern.test(input)) {
      return false;
    }
  }
  
  return true;
}

module.exports = {
  validateInput
};
