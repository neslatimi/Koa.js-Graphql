const Router = require('koa-router');
const { createApolloFetch } = require('apollo-fetch');
const uri = 'http://localhost:9000/graphql';
const fetch = createApolloFetch({ uri });
const router = new Router(); 
const query = require('../queries/query');
const mutation = require('../queries/mutation'); 

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
    // .post('/', async (ctx, next) => {
    //     const reqBody = ctx.request.body
    //     console.log(reqBody);
    //     await fetch({ 
    //         query: `mutation ( $title: String!, $start: String, $end: String, $allDay: Boolean){
    //         createEvent(title: $title, start: $start, end: $end, allDay: $allDay) 
    //             {
    //                 id
    //                 title
    //                 allDay
    //                 start
    //                 end
    //             }
    //     }`
    //     , variables: {
    //       title: reqBody.title,
    //       start: reqBody.start,
    //       end: reqBody.end,
    //       allDay:reqBody.allDay}})
    //         .then(res => {
    //         ctx.body = res.data
    //         })
    // })
    

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
.del('/:id', async (ctx, next) => {
  // const paramID = ctx.request.originalUrl.replace('/','')
  await fetch({ 
    // query: mutation.delete,
    query:`
    mutation {
      deleteEvent(id:"${paramID}")
  }`
    // variables: { id: ctx.params.id}})
    .then(res => {
      ctx.body = res.data
    })
});




module.exports = router