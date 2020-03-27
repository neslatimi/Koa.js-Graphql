const Router = require('koa-router');
const { createApolloFetch } = require('apollo-fetch');
const fetch = createApolloFetch({
    uri: 'http://localhost:9000/graphql',
  });
  const router = new Router();  


router
    .get('/', async (ctx, next) => {
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

        })
    
    .get('/:id', async (ctx, next) => {
        await fetch({ 
            query: `
            {
            listEventOne(id: "${ctx.params.id}")
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