import React from 'react';

export interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  validator?: (value: string) => { isValid: boolean; errorMessage?: string };
  icon?: string; // Path to icon image or SVG content
}

interface FormInputProps {
  fields: FormField[];
  onSubmit: (formData: Record<string, string>) => void;
  initialValues?: Record<string, string>;
}

/**
 * Form component that displays multiple fields for input
 */
const FormInput: React.FC<FormInputProps> = ({ 
  fields, 
  onSubmit,
  initialValues = {}
}: FormInputProps) => {
  const [formData, setFormData] = React.useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [isFormValid, setIsFormValid] = React.useState<boolean>(true);

  // Use useEffect to update formData when initialValues change
  React.useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  // Social media icons mapping
  const socialIcons: Record<string, JSX.Element> = {
    twitter: (
      <svg className="w-5 h-5 fill-current text-indigo-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    discord: (
      <svg className="w-5 h-5 fill-current text-indigo-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
      </svg>
    ),
    telegram: (
      <svg className="w-5 h-5 fill-current text-indigo-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    tiktok: (
      <svg className="w-5 h-5 fill-current text-indigo-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5 fill-current text-indigo-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913a5.885 5.885 0 001.384 2.126A5.868 5.868 0 004.14 23.37c.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558a5.898 5.898 0 002.126-1.384 5.86 5.86 0 001.384-2.126c.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913a5.89 5.89 0 00-1.384-2.126A5.847 5.847 0 0019.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227a3.81 3.81 0 01-.899 1.382 3.744 3.744 0 01-1.38.896c-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421a3.716 3.716 0 01-1.379-.899 3.644 3.644 0 01-.9-1.38c-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 01-2.88 0 1.44 1.44 0 012.88 0z"/>
      </svg>
    ),
    website: (
      <svg className="w-5 h-5 fill-current text-indigo-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    )
  };

  // Check overall form validity whenever errors change
  React.useEffect(() => {
    // If any error exists, the form is invalid
    const hasErrors = Object.values(errors).some(error => error !== '');
    setIsFormValid(!hasErrors);
  }, [errors]);

  const handleChange = (id: string, value: string): void => {
    setFormData((prev: Record<string, string>) => ({ ...prev, [id]: value }));
    
    // Validate on change if field has been touched
    if (touched[id] && fields.find((field: FormField) => field.id === id)?.validator) {
      validateField(id, value);
    }
  };

  const handleBlur = (id: string): void => {
    setTouched((prev: Record<string, boolean>) => ({ ...prev, [id]: true }));
    validateField(id, formData[id] || '');
  };

  const validateField = (id: string, value: string): boolean => {
    const field = fields.find((field: FormField) => field.id === id);
    
    // Clear existing error for this field
    setErrors((prev: Record<string, string>) => ({ ...prev, [id]: '' }));
    
    // Check required fields
    if (field?.required && !value.trim()) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [id]: 'This field is required' }));
      return false;
    }
    
    // Run validator if provided
    if (field?.validator && value.trim()) {
      const result = field.validator(value);
      if (!result.isValid) {
        setErrors((prev: Record<string, string>) => ({ ...prev, [id]: result.errorMessage || 'Invalid input' }));
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    const newTouched: Record<string, boolean> = {};
    
    fields.forEach((field: FormField) => {
      newTouched[field.id] = true;
      const fieldIsValid = validateField(field.id, formData[field.id] || '');
      if (!fieldIsValid) {
        isValid = false;
      }
    });
    
    setTouched(newTouched);
    
    // Only submit if all validations pass
    if (isValid) {
      onSubmit(formData);
    }
  };

  // Helper function to determine if field has an icon
  const hasIconForField = (fieldId: string): boolean => {
    return socialIcons[fieldId] !== undefined;
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-4">
        {fields.map((field: FormField) => (
          <div key={field.id} className="space-y-2">
            <div className="relative">
              {hasIconForField(field.id) && (
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  {socialIcons[field.id]}
                </div>
              )}
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                onBlur={() => handleBlur(field.id)}
                className={`w-full ${hasIconForField(field.id) ? 'pl-10' : 'pl-4'} pr-4 py-2 bg-[#222] border ${
                  errors[field.id] ? 'border-red-500' : 'border-indigo-500/30'
                } rounded-lg text-white/70 placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:text-white transition-colors`}
                aria-label={field.label}
              />
            </div>
            {errors[field.id] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6">
        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full px-4 py-3 rounded-lg text-white font-medium transition-colors ${
            isFormValid 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' 
              : 'bg-gray-500/50 cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default FormInput; 