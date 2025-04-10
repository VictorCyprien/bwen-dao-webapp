import * as React from 'react';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'textarea';
  placeholder?: string;
  required?: boolean;
}

interface FormInputProps {
  fields: FormField[];
  onSubmit: (formData: Record<string, string>) => void;
}

/**
 * Form component that displays multiple fields for input
 */
const FormInput: React.FC<FormInputProps> = ({ 
  fields, 
  onSubmit 
}: FormInputProps) => {
  const [formData, setFormData] = React.useState<Record<string, string>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Initialize form data with empty values for each field
  React.useEffect(() => {
    const initialData: Record<string, string> = {};
    fields.forEach(field => {
      initialData[field.id] = '';
    });
    setFormData(initialData);
  }, [fields]);

  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error when user types
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = 'This field is required';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="px-4 py-4 bg-[#151515] border border-gray-700 rounded-xl mx-4 mb-4 shadow-lg"
    >
      <div className="space-y-4">
        {fields.map(field => (
          <div key={field.id} className="flex flex-col">
            <label className="text-gray-300 text-sm mb-1">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="bg-[#222] border border-gray-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 min-h-[80px]"
              />
            ) : (
              <input
                type={field.type}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="bg-[#222] border border-gray-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
              />
            )}
            
            {errors[field.id] && (
              <p className="text-red-400 text-xs mt-1">{errors[field.id]}</p>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default FormInput; 