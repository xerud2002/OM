export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  phone: (phone: string): boolean => {
    // Romanian phone format: 07xxxxxxxx or +407xxxxxxxx
    const phoneRegex = /^(\+?40|0)?7\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  },

  cif: (cif: string): boolean => {
    // Romanian CIF/CUI validation (basic)
    const cifRegex = /^(RO)?\d{6,10}$/;
    return cifRegex.test(cif.replace(/\s/g, ""));
  },

  notEmpty: (value: string): boolean => {
    return value.trim().length > 0;
  },

  minLength: (value: string, min: number): boolean => {
    return value.trim().length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.trim().length <= max;
  },

  isPositiveNumber: (value: number | string): boolean => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return !isNaN(num) && num > 0;
  },

  isValidDate: (dateString: string): boolean => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  },

  isFutureDate: (dateString: string): boolean => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  },
};

export type ValidationRule = {
  validator: (value: any) => boolean;
  message: string;
};

export const validateField = (
  value: any,
  rules: ValidationRule[]
): { valid: boolean; error?: string } => {
  for (const rule of rules) {
    if (!rule.validator(value)) {
      return { valid: false, error: rule.message };
    }
  }
  return { valid: true };
};
