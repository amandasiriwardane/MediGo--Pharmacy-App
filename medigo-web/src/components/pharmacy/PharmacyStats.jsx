import React from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import {
  Inventory,
  ShoppingBag,
  TrendingUp,
  LocalShipping
} from '@mui/icons-material';

const PharmacyStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: <Inventory sx={{ fontSize: 40 }} />,
      color: 'primary.main',
      bgColor: 'primary.light'
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: <ShoppingBag sx={{ fontSize: 40 }} />,
      color: 'success.main',
      bgColor: 'success.light'
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: <LocalShipping sx={{ fontSize: 40 }} />,
      color: 'warning.main',
      bgColor: 'warning.light'
    },
    {
      title: 'Revenue',
      value: `Rs ${stats?.totalRevenue || 0}`,
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: 'info.main',
      bgColor: 'info.light'
    }
  ];

  return (
    <Grid container spacing={3}>
      {statCards.map((stat, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stat.value}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 2,
                  bgcolor: stat.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color
                }}
              >
                {stat.icon}
              </Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default PharmacyStats;