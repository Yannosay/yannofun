export async function onRequest({ request }) {
  const url = new URL(request.url)

  // Serve index.html for root
  if (url.pathname === '/' || url.pathname === '/index.html') {
    return fetch(`${url.origin}/index.html`)
  }

  // Everything else: serve 404.html
  return fetch(`${url.origin}/404.html`).then(resp =>
    new Response(resp.body, {
      status: 404,
      headers: resp.headers
    })
  )
}
