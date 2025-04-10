import { OnboardingStep } from '../../BabyWenOnboarding';
import { FormField } from '../components/FormInput';

// Define the form fields for the step
const formFields: FormField[] = [
  {
    id: 'fullName',
    label: 'Full Name',
    type: 'text',
    placeholder: 'Enter your full name',
    required: true
  },
  {
    id: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email address',
    required: true
  },
  {
    id: 'bio',
    label: 'Bio',
    type: 'textarea',
    placeholder: 'Tell us a bit about yourself',
    required: false
  }
];

const FormStep: OnboardingStep = {
  id: 'form',
  messages: [
    {
      content: "DEMO FORM: Please fill out the following information."
    }
  ],
  formFields,
  onResponse: (response: string) => {
    // Process the form data
    const formData = JSON.parse(response) as Record<string, string>;
    console.log('Form data received:', formData);
    
    return {
      responseMessage: `Thank you for submitting the form! This demonstrates how form inputs work.`
    };
  }
};

export default FormStep; 