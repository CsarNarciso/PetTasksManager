const COOKIE_OPTIONS = {
    httpOnly: true, // Secure HTTP cookie
    secure: process.env.NODE_ENV === 'production' ? true : false, // HTTPS in production  and HTTP in development
    path: "/", // Available in the entire app
    sameSite: 'strict' as const, // Prevent CSRF
    maxAge: 3600000 // 1 hour
};

export default COOKIE_OPTIONS;