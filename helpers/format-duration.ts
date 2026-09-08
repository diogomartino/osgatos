const formatDuration = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

const formatMinutes = (seconds: number) =>
  `${Math.max(1, Math.round(seconds / 60))} min`;

export { formatDuration, formatMinutes };
