const koa = require('koa');
const graphqlHTTP = require('koa-graphql');
const mongoose = require('mongoose');
const mount = require('koa-mount');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const schema = require('./graphql/schema');
const root = require('./graphql/root');
const eventRoutes = require('./routes/event_routes')

const router = new Router();
const app = new koa();

mongoose.connect('mongodb://localhost:27017/calendar', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const db = mongoose.connection;

db
  .on('error', console.error.bind( console, 'conection error:'))
  .once('open', ()=> console.log('Database connected'));


app
  .use(bodyParser())
  .use(router.routes())
  .use( async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    await next();
  })
  .use( mount('/graphql', graphqlHTTP({
      schema,
      rootValue: root,
      graphiql: true
    }))
  )
  .use(eventRoutes.routes())
  .listen(9000)
  .on('error', err => {
    console.log('server error', err);
  });


