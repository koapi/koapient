module.exports = {
  universal: {
    server: '/api',
    clients: [
      { name: 'website', mount: '/' }
    ]
  },
  port: 5000
}