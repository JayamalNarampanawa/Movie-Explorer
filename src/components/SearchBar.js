import { Button, InputAdornment, Stack, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

export default function SearchBar({ initialValue = '', onSearch }) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(value.trim());
  };

  return (
    <Stack
      component="form"
      direction={{ xs: 'column', sm: 'row' }}
      gap={1.5}
      onSubmit={handleSubmit}
      sx={{ width: '100%' }}
    >
      <TextField
        id="movie-search-input"
        fullWidth
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search movies by title"
        aria-label="Search movies"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
      />
      <Button type="submit" variant="contained" startIcon={<SearchIcon />} sx={{ minHeight: 56, px: 3 }}>
        Search
      </Button>
    </Stack>
  );
}
