module.exports = {
  universal: {
    ssr: false,
    server: '/api'
  },
  port: 5000,
  database : {
    client: 'pg',
    connection: {
      host     : 'localhost',
      user     : 'postgres',
      password : '123456',
      database : 'koapi_boilerplate',
      charset  : 'utf8'
    },
  },
};
