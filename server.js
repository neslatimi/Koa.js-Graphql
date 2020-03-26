const koa = require('koa');
const graphqlHTTP = require('koa-graphql');
const mongoose = require('mongoose');
const mount = require('koa-mount');
const router = require('koa-route');
const { createApolloFetch } = require('apollo-fetch');
const bodyParser = require('koa-bodyparser');

const schema = require('./graphql/schema');
const root = require('./graphql/root');

const fetch = createApolloFetch({
  uri: 'http://localhost:9000/graphql',
});


mongoose.connect('mongodb://localhost:27017/calendar', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const db = mongoose.connection
db.on('error', console.error.bind( console, 'conection error:'));
db.once('open', ()=> console.log('Database connected'));

const app = new koa();
// app.use(bodyParser());

app.use(
  mount('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
  }))
);

// Routing
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
    }`
  
  }).then(res => {
      ctx.body = res.data
    })
  
}));

app.use(router.get('/:id', async (ctx, next) => {
  const paramID = ctx.request.originalUrl.replace('/','');
  await fetch({ 
    query: `
    {
      listEventOne(id: "${paramID}")
     {
        id
        title
        allDay
        start
        end
      }  
    }
    `
  }).then(res => {
        ctx.body = res.data
    })
  
}));

app.use(router.post('/', async ctx => {
  const reqBody = ctx.request.body
  console.log(reqBody.title);
  await fetch({ 
    query: ` mutation{
      createEvent(title: "${reqBody.title}", start: "${reqBody.start}", end: "${reqBody.end}", allDay: ${reqBody.allDay}) 
          {
              id
              title
              allDay
              start
              end
          }
  }`})
    .then(res => {
      ctx.body = res.data
    })
}));

// app.use(router.put('/:id', async ctx => {
//   const paramID = ctx.request.originalUrl.replace('/','')
//   // const reqBody = ctx.req.body
//   // console.log(reqBody);
//   console.log(ctx.request);
//   await fetch({ 
//     query: `
//     mutation {
//       updateEvent(id:"${paramID}", title: "Valami"){
//           id
//           title
//           allDay
//           start
//           end
//       }
//   }`})
//     .then(res => {
//       console.log(res.data);
//       ctx.body = res.data
//     })
// }));

app.use(router.del('/:id', async ctx => {
  const paramID = ctx.request.originalUrl.replace('/','')
  await fetch({ 
    query: `
    mutation {
      deleteEvent(id:"${paramID}")
  }`})
    .then(res => {
      ctx.body = res.data
    })
}));


app.listen(9000);

app.on('error', err => {
  console.log('server error', err);
});


