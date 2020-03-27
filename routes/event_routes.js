const Router = require('koa-router');
const { createApolloFetch } = require('apollo-fetch');
const uri = 'http://localhost:9000/graphql';
const fetch = createApolloFetch({ uri });
const router = new Router(); 
const query = require('../queries/query') 

router
    .get('/', async (ctx, next) => {
            await fetch({ 
            query: query.list
            }).then(res => {
                ctx.body = res.data
            })

        })
    
    .get('/:id', async (ctx, next) => {
        await fetch({ 
            query: query.listOne,
            variables: { id : ctx.params.id}
        }).then(res => {
                ctx.body = res.data
            })
        
        })
    .post('/', async ctx => {
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
    })
    

.put('/:id', async ctx => {
  const paramID = ctx.request.originalUrl.replace('/','')
  const reqBody = ctx.req.body
  console.log(reqBody);
  console.log(ctx.request);
  await fetch({ 
    query: `
    mutation {
      updateEvent(id:"${paramID}", title: "Valami"){
          id
          title
          allDay
          start
          end
      }
  }`})
    .then(res => {
      console.log(res.data);
      ctx.body = res.data
    })
})
.del('/:id', async ctx => {
  const paramID = ctx.request.originalUrl.replace('/','')
  await fetch({ 
    query: `
    mutation {
      deleteEvent(id:"${paramID}")
  }`})
    .then(res => {
      ctx.body = res.data
    })
});




module.exports = router