export const config = {
  api: {
    tmdb: {
      baseUrl: 'https://api.themoviedb.org/3',
      imageBaseUrl: 'https://image.tmdb.org/t/p',
    },
    routes: {
      media: '/api/media',
      auth: '/api/auth',
      user: '/api/user',
      watchlist: '/api/watchlist',
    }
  },
  theme: {
    colors: {
      primary: 'hsl(var(--primary))',
      secondary: 'hsl(var(--secondary))',
      background: 'hsl(var(--background))',
    }
  },
  auth: {
    sessionTimeout: 30 * 24 * 60 * 60 * 1000, // 30 days
    retryAttempts: 3,
    retryDelay: 1000,
  }
}

