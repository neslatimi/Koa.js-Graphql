const koa = require('koa');
const graphqlHTTP = require('koa-graphql');
const mongoose = require('mongoose');
const mount = require('koa-mount');
const router = require('koa-route');
const { createApolloFetch } = require('apollo-fetch');

const schema = require('./graphql/schema');
const root = require('./graphql/root');

const fetch = createApolloFetch({
  uri: 'http://localhost:9000/graphql',
});


mongoose.connect('mongodb://localhost:27017/calendar', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true
});

const db = mongoose.connection
db.on('error', console.error.bind( console, 'conection error:'));
db.once('open', ()=> console.log('Database connected'));

const app = new koa();

app.use(router.get('/', async ctx => {
  await fetch({ 
    query: `
    {
      listEvents {
          id
          title
          allDay
          start
          end
      }
    }`}).then(res => {
      ctx.body = res.data
    })
  
}));
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
