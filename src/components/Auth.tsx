import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Box, Tab, Tabs, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const Auth: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0); // 0 = Login, 1 = Register, 2 = Create Organization
  const navigate = useNavigate();
  const [secretToken, setSecretToken] = useState<string | null>(null);
  const [organizationCreationError, setOrganizationCreationError] = useState<string | null>(null);

  // Separate validation schemas for each tab
  const validationSchema = Yup.object().shape({
    // Login schema
    ...(tabIndex === 0 && {
      email: Yup.string().email('Invalid email format').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    // Register schema
    ...(tabIndex === 1 && {
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email format').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      secretToken: Yup.string().required('Secret Token is required'),
    }),
    // Create Organization schema
    ...(tabIndex === 2 && {
      organizationName: Yup.string().required('Organization Name is required'),
      emailDomain: Yup.string().email('Invalid email format').required('Email domain is required'),
    }),
  });

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      name: '', // Only needed for registration
      secretToken: '', // Only needed for registration
      organizationName: '', // Only needed for organization creation
      emailDomain: '', // Only needed for organization creation
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
            localStorage.setItem('settings', JSON.stringify(response.data.settings)); // Store settings
            navigate('/'); // Redirect to home page after successful login
          }
        } else if (tabIndex === 1) {
          // Logic for registration
          const response = await axios.post(`${API_URL}/auth/register`, {
            email: values.email,
            password: values.password,
            name: values.name,
            secretToken: values.secretToken, // Include secret token in registration request
          });

          // If registration successful, move to login tab
          if (response.status === 201) {
            setTabIndex(0);
          }
        } else if (tabIndex === 2) {
          // Logic for creating an organization
          const response = await axios.post(`${API_URL}/organizations`, {
            name: values.organizationName,
            emailDomain: values.emailDomain,
          });

          if (response.status === 201) {
            setSecretToken(response.data.secretToken);
            formik.resetForm();
          }
        }
      } catch (error) {
        if (tabIndex === 2) {
          setOrganizationCreationError('Failed to create organization. Please try again.');
        } else {
          formik.setErrors({ password: 'Authentication failed. Please check your details.' });
        }
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        {/* Tabs to switch between Login, Register, and Create Organization */}
        <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)}>
          <Tab label="Login" />
          <Tab label="Register" />
          <Tab label="Create Organization" />
        </Tabs>

        {/* Display form validation errors */}
        {formik.errors.password && (
          <Typography color="error">{formik.errors.password}</Typography>
        )}

        {/* Form for Login, Register, and Organization Creation */}
        <form onSubmit={formik.handleSubmit}>
          {/* Login Tab */}
          {tabIndex === 0 && (
            <>
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
                Login
              </Button>
            </>
          )}

          {/* Register Tab */}
          {tabIndex === 1 && (
            <>
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
              <TextField
                fullWidth
                label="Secret Token"
                variant="outlined"
                name="secretToken"
                value={formik.values.secretToken}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.secretToken && Boolean(formik.errors.secretToken)}
                helperText={formik.touched.secretToken && formik.errors.secretToken}
                margin="normal"
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                Register
              </Button>
            </>
          )}

          {/* Create Organization Tab */}
          {tabIndex === 2 && (
            <>
              <TextField
                fullWidth
                label="Organization Name"
                variant="outlined"
                name="organizationName"
                value={formik.values.organizationName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.organizationName && Boolean(formik.errors.organizationName)}
                helperText={formik.touched.organizationName && formik.errors.organizationName}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email Domain"
                variant="outlined"
                name="emailDomain"
                value={formik.values.emailDomain}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.emailDomain && Boolean(formik.errors.emailDomain)}
                helperText={formik.touched.emailDomain && formik.errors.emailDomain}
                margin="normal"
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                Create Organization
              </Button>

              {/* Display secret token after organization creation */}
              {secretToken && (
                <Typography sx={{ mt: 4 }}>
                  <strong>Secret Token:</strong> {secretToken}
                </Typography>
              )}

              {/* Error Handling */}
              {organizationCreationError && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {organizationCreationError}
                </Typography>
              )}
            </>
          )}
        </form>
      </Box>
    </Container>
  );
};

export default Auth;
