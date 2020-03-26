const koa = require('koa');
const graphqlHTTP = require('koa-graphql');
const mongoose = require('mongoose');
const mount = require('koa-mount');
// const bodyParser = require('koa-bodyparser');

const schema = require('./graphql/schema');
const root = require('./graphql/root');

mongoose.connect('mongodb://localhost:27017/calendar', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true
});

const db = mongoose.connection
db.on('error', console.error.bind( console, 'conection error:'));
db.once('open', ()=> console.log('Database connected'));

const app = new koa();
// app.use(bodyParser())
app.listen(9000);

app.on('error', err => {
  console.log('server error', err);
});

app.use(
  mount('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
  }))
);