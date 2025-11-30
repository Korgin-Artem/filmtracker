import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { Person } from '@mui/icons-material';

const PersonCard = ({ person, onClick }) => {
  return (
    <Card 
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        '&:hover': onClick ? { transform: 'translateY(-4px)' } : {}
      }}
      onClick={onClick}
    >
      {person.photo ? (
        <CardMedia
          component="img"
          height="200"
          image={person.photo}
          alt={`${person.first_name} ${person.last_name}`}
          sx={{ objectFit: 'cover' }}
        />
      ) : (
        <Box
          sx={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'grey.800',
          }}
        >
          <Person sx={{ fontSize: 60, color: 'grey.500' }} />
        </Box>
      )}
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          {person.first_name} {person.last_name}
        </Typography>
        {person.bio && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {person.bio}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonCard;