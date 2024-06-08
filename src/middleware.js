import { NextResponse } from 'next/server';

export function middleware(req) {
    const auth = req.headers.get('cookie')?.includes('token');
    
    const isAuthPage = req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register';
    
    if (isAuthPage) {
        if (auth) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    } else {
        if (!auth) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/login',
        '/register',
        '/post/:path*',
        '/posts'
    ],
};
