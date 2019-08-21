// Update with your config settings.

module.exports = {

  // development: {
  //   client: 'sqlite3',
  //   connection: {
  //     filename: './dev.sqlite3'
  //   }
  // },

  development: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      database: 'postgres',
      user:     'postgres',
      password: 'mysecretpassword'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: '10.75.160.3',
      database: 'postgres',
      user:     'postgres',
      password: '9iEiF3j1E4MgnzKL'
    },
    pool: {
      min: 2,
      max: 10
    }
  }

};
