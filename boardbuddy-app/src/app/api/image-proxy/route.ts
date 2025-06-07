// src/app/api/image-proxy/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  // Security validation
  if (!url || !url.startsWith('https://api.kilterboardapp.com/')) {
    return new Response('Forbidden: Invalid image URL', { 
      status: 403,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  try {
    // Fetch image from Kilter Board API
    const response = await fetch(url, {
      headers: {
        // Forward necessary headers if required
        'User-Agent': 'BoardBuddy/1.0 (+https://github.com/lczm/boardbuddy)'
      }
    });

    // Handle non-OK responses
    if (!response.ok) {
      return new Response(`Image fetch failed: ${response.statusText}`, {
        status: response.status,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }

    // Get image buffer and content type
    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';

    // Return proxied image
    return new Response(Buffer.from(arrayBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=604800', // 1 week cache
        'Access-Control-Allow-Origin': '*',
        'X-Proxy-Source': 'BoardBuddy Image Proxy'
      }
    });

  } catch (error) {
    console.error('Image proxy error:', error);
    return new Response('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}