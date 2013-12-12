## Sails.js example for the [TodoMVC](http://todomvc.com/) project
A simple todo list application using:
* Backend: Sails.js with socket.io (websockets), waterline, mysql
* Frontend: JQuery, Handlebar.js

### Getting started
Learn more about Sails.js at [http://sailsjs.org/](http://sailsjs.org/).

#### Install Sails.js
~~~bash
$ sudo npm -g install sails
~~~

#### Install dependencies
~~~bash
$ npm install
~~~

#### Configure database settings

Edit `config/adapters.js`:

~~~javascript
development: {
        module: 'sails-mysql',
        host: DB_HOST,
        user: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_NAME,
        pool: true,
        connectionLimit: 2,
        waitForConnections: true
    }
~~~

#### Run locally

~~~bash
$ sails lift
~~~

#### Visit in Browser
When the server is started, you can visit the app at:
    [http://localhost:1337](http://localhost:1337)

### Thanks
We would like to thank [Sindre Sorhus](https://github.com/sindresorhus) for the TodoMVC templates and the [JQuery Example code](https://github.com/tastejs/todomvc/tree/gh-pages/architecture-examples/jquery)
we had adopted.
