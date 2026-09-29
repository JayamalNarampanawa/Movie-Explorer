import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material';

export function LoadingState({ label = 'Loading movies...' }) {
  return (
    <Stack alignItems="center" gap={2} sx={{ py: 8 }}>
      <CircularProgress />
      <Typography color="text.secondary">{label}</Typography>
    </Stack>
  );
}

export function ErrorState({ message }) {
  return (
    <Box sx={{ py: 3 }}>
      <Alert severity="warning">{message}</Alert>
    </Box>
  );
}

export function EmptyState({ title, message }) {
  return (
    <Stack alignItems="center" gap={1} sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h6">{title}</Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 460 }}>
        {message}
      </Typography>
    </Stack>
  );
}
