import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Box, Tab, Tabs, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const Auth: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0); // 0 = Login, 1 = Register
  const navigate = useNavigate();

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    ...(tabIndex === 1 && { name: Yup.string().required('Name is required') }), // Additional validation for registration
  });

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      name: '', // Only needed for registration
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (tabIndex === 0) {
          // Logic for login
          const response = await axios.post(`${API_URL}/auth/login`, {
            email: values.email,
            password: values.password,
          });

          if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token); // Store token
            localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user info
            navigate('/'); // Redirect to home page after successful login
          }
        } else {
          // Logic for registration
          const response = await axios.post(`${API_URL}/auth/register`, {
            email: values.email,
            password: values.password,
            name: values.name,
          });

          // If registration successful, move to login tab
          if (response.status === 201) {
            setTabIndex(0);
          }
        }
      } catch (error) {
        formik.setErrors({ password: 'Authentication failed. Please check your details.' });
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        {/* Tabs to switch between Login and Register */}
        <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)}>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {/* Display form validation errors */}
        {formik.errors.password && (
          <Typography color="error">{formik.errors.password}</Typography>
        )}

        {/* Form for both login and registration */}
        <form onSubmit={formik.handleSubmit}>
          {/* Name field is only shown on Register */}
          {tabIndex === 1 && (
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              margin="normal"
            />
          )}
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            margin="normal"
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            {tabIndex === 0 ? 'Login' : 'Register'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Auth;
