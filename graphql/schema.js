const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Event {
        id: ID,
        title: String,
        allDay: Boolean,
        start: String,
        end: String
    }
    type Query {
        listEvents: [Event]
        listEventOne(id: String!): Event
    }
    type Mutation {
        createEvent(title: String!, start: String, end: String, allDay: Boolean): Event
        updateEvent(id: String!, title: String, start: String, end: String, allDay: Boolean): Event
        deleteEvent(id: String!): String
    }
`);