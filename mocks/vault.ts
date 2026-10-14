// mocks/vault.js

export function vaultMock(req:any, res:any, next:any) {
  if (!req.url.startsWith('/v1/')) {
    return next()
  }

  if (req.url === '/v1/secret/data/myapp') {
    res.setHeader('Content-Type', 'application/json')

    return res.end(JSON.stringify({
      data: {
        data: {
          username: 'test-user',
          password: 'test-password'
        }
      }
    }))
  }

  res.statusCode = 404
  res.end(JSON.stringify({
    errors: ['secret not found']
  }))
}