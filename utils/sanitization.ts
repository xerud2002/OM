/**
 * Input Sanitization Utilities
 * 
 * This module provides comprehensive input sanitization functions
 * to prevent XSS attacks and ensure data integrity across the platform.
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes dangerous tags and attributes while preserving safe formatting
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove dangerous event handlers
  sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove dangerous tags
  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'link', 'meta', 'style'];
  const tagRegex = new RegExp(`<\/?(?:${dangerousTags.join('|')})[^>]*>`, 'gi');
  sanitized = sanitized.replace(tagRegex, '');
  
  // Remove javascript: and data: protocols
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/data:/gi, '');
  
  return sanitized.trim();
}

/**
 * Sanitize plain text input - removes HTML and dangerous characters
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Remove all HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  sanitized = sanitized
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&amp;/g, '&'); // This should be last
  
  return sanitized.trim();
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Remove spaces and convert to lowercase
  let sanitized = input.trim().toLowerCase();
  
  // Remove any HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  // Only allow valid email characters
  sanitized = sanitized.replace(/[^a-z0-9@._-]/g, '');
  
  return sanitized;
}

/**
 * Sanitize phone number input
 */
export function sanitizePhone(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Only allow digits, spaces, +, -, (, )
  sanitized = sanitized.replace(/[^0-9\s+\-()]/g, '');
  
  return sanitized.trim();
}

/**
 * Sanitize numeric input
 */
export function sanitizeNumber(input: string | number): number | null {
  if (typeof input === 'number') {
    return isNaN(input) ? null : input;
  }
  
  if (typeof input !== 'string') return null;
  
  // Remove HTML tags and non-numeric characters (except decimal point)
  const sanitized = input.replace(/<[^>]*>/g, '').replace(/[^0-9.-]/g, '');
  
  const parsed = parseFloat(sanitized);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Sanitize URL input
 */
export function sanitizeUrl(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '').trim();
  
  // Remove dangerous protocols
  if (sanitized.match(/^(javascript|data|vbscript):/i)) {
    return '';
  }
  
  // Ensure URL starts with http/https if it doesn't have a protocol
  if (sanitized && !sanitized.match(/^https?:\/\//i) && !sanitized.match(/^\/\//)) {
    sanitized = 'https://' + sanitized;
  }
  
  return sanitized;
}

/**
 * Sanitize file name
 */
export function sanitizeFileName(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove dangerous characters and path traversal attempts
  sanitized = sanitized.replace(/[<>:"/\\|?*\x00-\x1f]/g, '');
  sanitized = sanitized.replace(/\.\./g, '');
  
  // Limit length
  if (sanitized.length > 255) {
    const extension = sanitized.split('.').pop();
    const nameWithoutExt = sanitized.substring(0, sanitized.lastIndexOf('.'));
    sanitized = nameWithoutExt.substring(0, 255 - (extension ? extension.length + 1 : 0)) + 
                (extension ? '.' + extension : '');
  }
  
  return sanitized.trim();
}

/**
 * Sanitize address input
 */
export function sanitizeAddress(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Remove HTML tags but preserve Romanian diacritics and common punctuation
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Allow letters (including Romanian diacritics), numbers, spaces, and common punctuation
  sanitized = sanitized.replace(/[^a-zA-ZăâîșțĂÂÎȘȚ0-9\s.,\-/]/g, '');
  
  return sanitized.trim();
}

/**
 * Comprehensive object sanitization for Firestore documents
 */
export function sanitizeFirestoreData(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) {
      continue; // Skip undefined/null values
    }
    
    // Sanitize based on field type/name
    switch (key) {
      case 'email':
      case 'customerEmail':
      case 'companyEmail':
        sanitized[key] = sanitizeEmail(value);
        break;
        
      case 'phone':
      case 'customerPhone':
        sanitized[key] = sanitizePhone(value);
        break;
        
      case 'price':
      case 'rooms':
      case 'fromFloor':
      case 'toFloor':
        const numValue = sanitizeNumber(value);
        if (numValue !== null) sanitized[key] = numValue;
        break;
        
      case 'fromAddress':
      case 'toAddress':
      case 'fromCity':
      case 'toCity':
      case 'fromCounty':
      case 'toCounty':
        sanitized[key] = sanitizeAddress(value);
        break;
        
      case 'details':
      case 'message':
      case 'customerName':
      case 'companyName':
      case 'displayName':
        sanitized[key] = sanitizeText(value);
        break;
        
      case 'mediaUrls':
        if (Array.isArray(value)) {
          sanitized[key] = value.map(url => sanitizeUrl(url)).filter(url => url);
        }
        break;
        
      default:
        // For other fields, apply basic text sanitization if string
        if (typeof value === 'string') {
          sanitized[key] = sanitizeText(value);
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          sanitized[key] = value;
        } else if (value instanceof Date) {
          sanitized[key] = value;
        } else if (Array.isArray(value)) {
          // Recursively sanitize array elements if they're strings
          sanitized[key] = value.map(item => 
            typeof item === 'string' ? sanitizeText(item) : item
          );
        } else if (typeof value === 'object') {
          // Recursively sanitize nested objects
          sanitized[key] = sanitizeFirestoreData(value);
        } else {
          sanitized[key] = value;
        }
    }
  }
  
  return sanitized;
}

/**
 * Validate and sanitize form input
 */
export function validateAndSanitizeInput(
  value: any,
  type: 'email' | 'phone' | 'text' | 'number' | 'url' | 'address' | 'filename'
): { sanitized: any; isValid: boolean } {
  let sanitized: any;
  let isValid = true;
  
  try {
    switch (type) {
      case 'email':
        sanitized = sanitizeEmail(value);
        // Basic email validation
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized);
        break;
        
      case 'phone':
        sanitized = sanitizePhone(value);
        // Romanian phone validation
        isValid = /^(\+?40|0)?7\d{8}$/.test(sanitized.replace(/\s/g, ''));
        break;
        
      case 'number':
        sanitized = sanitizeNumber(value);
        isValid = sanitized !== null && sanitized >= 0;
        break;
        
      case 'url':
        sanitized = sanitizeUrl(value);
        isValid = sanitized === '' || /^https?:\/\/.+/.test(sanitized);
        break;
        
      case 'address':
        sanitized = sanitizeAddress(value);
        isValid = sanitized.length > 0 && sanitized.length <= 255;
        break;
        
      case 'filename':
        sanitized = sanitizeFileName(value);
        isValid = sanitized.length > 0 && sanitized.length <= 255;
        break;
        
      case 'text':
      default:
        sanitized = sanitizeText(value);
        isValid = sanitized.length <= 5000; // Reasonable text limit
        break;
    }
  } catch (error) {
    console.error('Input sanitization error:', error);
    sanitized = '';
    isValid = false;
  }
  
  return { sanitized, isValid };
}