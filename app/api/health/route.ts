export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  });
}
