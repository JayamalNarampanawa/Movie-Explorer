import { FormControl, InputLabel, MenuItem, Select, Slider, Stack, TextField, Typography } from '@mui/material';

export default function MovieFilters({ genres, filters, onChange }) {
  const currentYear = new Date().getFullYear();

  const updateFilter = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} gap={2} alignItems={{ md: 'center' }}>
      <FormControl sx={{ minWidth: { xs: '100%', md: 190 } }}>
        <InputLabel id="genre-filter-label">Genre</InputLabel>
        <Select
          labelId="genre-filter-label"
          label="Genre"
          value={filters.genre}
          onChange={(event) => updateFilter('genre', event.target.value)}
        >
          <MenuItem value="">All genres</MenuItem>
          {genres.map((genre) => (
            <MenuItem key={genre.id} value={genre.id}>
              {genre.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Year"
        type="number"
        value={filters.year}
        onChange={(event) => updateFilter('year', event.target.value)}
        inputProps={{ min: 1900, max: currentYear + 2 }}
        sx={{ minWidth: { xs: '100%', md: 140 } }}
      />

      <Stack sx={{ minWidth: { xs: '100%', md: 240 }, px: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Minimum rating: {filters.rating || 0}
        </Typography>
        <Slider
          value={Number(filters.rating || 0)}
          min={0}
          max={10}
          step={0.5}
          marks={[
            { value: 0, label: '0' },
            { value: 5, label: '5' },
            { value: 10, label: '10' }
          ]}
          onChange={(_, value) => updateFilter('rating', value)}
          valueLabelDisplay="auto"
        />
      </Stack>
    </Stack>
  );
}
