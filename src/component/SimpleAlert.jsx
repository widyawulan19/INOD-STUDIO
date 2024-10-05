import React, { useState } from 'react'
import MuiAlert from '@mui/material/Alert'
import { Button, Snackbar } from '@mui/material'

const Alert = React.forwardRef(function Alert(props, ref){
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props}/>
})

const SimpleAlert=()=> {
    const [open, setOpen] = useState(false);
    const handleClick = () =>{
        setOpen(true);
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway'){
            return;
        }
        setOpen(false)
    }

  return (
    <div>
        <Button variant='contained' color='primary' onClick={handleClick}>
            Tampilkan Alert
        </Button>
        <Snackbar 
            open={open} 
            autoHideDuration={6000} 
            onClose={handleClose}
            anchorOrigin={{vertical:'top', horizontal:'right'}}//menempatkan alert di kanan atas
        >
            <Alert onClose={handleClose} severity='success' action={
                <Button color='inherit' size='small' onClick={handleClose}>Undo</Button>
            }
            sx={{
                backgroundColor: 'rgb(214, 222, 214)', // Mengubah warna latar belakang
                border:'1px solid green',
                color: 'green', // Mengubah warna teks
                borderRadius: '8px', // Menambahkan sudut melengkung
                padding: '10px', // Menambahkan padding
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)', // Menambahkan bayangan
            }} 
            >
                silahkan pilih workspace tujuan
            </Alert>
        </Snackbar>
    </div>
  )
}

export default SimpleAlert