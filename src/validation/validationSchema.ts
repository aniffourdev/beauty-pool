import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

export const signUpSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(4, 'Password must be at least 4 characters')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d).+$/, 'Password is too weak')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm password is required'),
  phone: Yup.string().required('Phone number is required'),
  location: Yup.string().required('Country is required'),
  birthday: Yup.date().required('Birthday is required'), // Add this line
});