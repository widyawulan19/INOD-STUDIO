import React from 'react'
import { createTheme, keyframes } from '@mui/material'

const Theme = createTheme({
    palette:{
        primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#dc004e',
          },
          success: {
            main: '#28a745',
          },
          error: {
            main: '#dc3545',
          },
    },
    components:{
        MuiButton:{
            styleOverrides:{
                root:{
                    textTransform:'none',
                    borderRadius: '8px'
                }
            }
        },
        MuiAlertTitle:{
            styleOverrides:{
                root:{
                    position:'absolute',
                    top:'8px',
                    right:'16px',
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    width:'30%',
                    height:'50px',
                    borderBottom:'3px solid green',
                    borderRadius: '5px',
                    fontSize: '12px',
                    padding: '0 8px',
                    display:'flex',
                    alignItems:'center',
                    marginRight:'20px',
                    animation: 'slideIn 1s ease-out',
                    '@keyframes slideIn': {
                        'from': {
                            transform: 'translateX(100%)', /* Memulai dari luar layar (kanan) */
                            opacity: '0', /* Awalnya tidak terlihat */
                        },
                        'to': {
                            transform: 'translateX(0)', /* Berhenti di posisi semula */
                            opacity: '1', /* Menjadi terlihat */
                        }
                    }
                    
                }
            }
        }
    }
})

export default Theme