const Router = require('koa-router');
const { createApolloFetch } = require('apollo-fetch');

const uri = 'http://localhost:9000/graphql';
const fetch = createApolloFetch({ uri });
const router = new Router();

const query = require('../queries/query');
const mutation = require('../queries/mutation');

router
  .get('/', async (ctx, _next) => {
    await fetch({
      query: query.list
    }).then(res => {
      ctx.body = res.data
    })

  })
  .get('/:id', async (ctx, _next) => {
    await fetch({
      query: query.listOne,
      variables: { id: ctx.params.id }
    }).then(res => {
      ctx.body = res.data
    })

  })
  .post('/', async (ctx, _next) => {
    await fetch({
      query: mutation.create,
      variables: { 
        title: ctx.request.body.title,
        start: ctx.request.body.start,
        end: ctx.request.body.end,
        allDay: ctx.request.body.allDay
      }
    }).then(res => {
      ctx.body = res.data
    })
  })
  .put('/:id', async (ctx, _next) => {
    console.log(ctx.request.body);
    await fetch({
      query: mutation.update,
      variables: {
        id: ctx.params.id,
        title: ctx.req.body.title,
        start: ctx.req.body.start,
        end: ctx.req.body.end,
        allDay: ctx.req.body.allDay
      }
    })
      .then(res => {
        ctx.body = res.data
      })
  })
  .del('/:id', async (ctx, next) => {
    await fetch({
      query: mutation.delete,
      variables: { id: ctx.params.id }
    })
      .then(res => {
        ctx.body = res.data
      })
  })




module.exports = router