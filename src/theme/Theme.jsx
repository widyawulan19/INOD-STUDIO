import { createTheme } from '@mui/material';

const Theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    success: {
      main: '#28a745',
      contrastText: '#fff', // Warna teks untuk alert success
    },
    error: {
      main: '#dc3545',
      contrastText: '#fff', // Warna teks untuk alert error
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: (ownerState) => ({
          ...(ownerState.severity === 'success' && {
            backgroundColor: '#d4edda', // Warna latar untuk success
            color: '#155724', // Warna teks untuk success
            border: '1px solid #28a745', // Border untuk success
          }),
          ...(ownerState.severity === 'error' && {
            backgroundColor: '#f8d7da', // Warna latar untuk error
            color: '#721c24', // Warna teks untuk error
            border: '1px solid #dc3545', // Border untuk error
          }),
          borderRadius: '5px',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
        }),
      },
    },
    MuiAlertTitle: {
      styleOverrides: {
        root: (ownerState) => ({
          ...(ownerState.severity === 'success' && {
            backgroundColor: '#d4edda',
            color: '#155724',
          }),
          ...(ownerState.severity === 'error' && {
            backgroundColor: '#f8d7da',
            color: '#721c24',
          }),
          position: 'absolute',
          top: '8px',
          right: '16px',
          width: '30%',
          height: '50px',
          borderBottom: `3px solid ${ownerState.severity === 'success' ? '#28a745' : '#dc3545'}`,
          borderRadius: '5px',
          fontSize: '12px',
          padding: '0 8px',
          display: 'flex',
          alignItems: 'center',
          marginRight: '20px',
        }),
      },
    },
  },
});

export default Theme;
