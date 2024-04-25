'use client'
import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Stack } from '@mui/material'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <Stack direction="row" spacing={2} alignItems={'center'} justifyContent={'space-between'} flexGrow={1}>
            <Link href="/">
              <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' }, color: '#fff' }}>
                LOGO
              </Typography>
            </Link>

            <Button
              variant="contained"
              sx={{
                backgroundColor: '#fff',
                color: '#000',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.5)',
                },
              }}
              href="/signin"
            >
              Login
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
