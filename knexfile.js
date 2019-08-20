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
      database: 'postgres',
      user:     'postgres',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    }
  }

};
