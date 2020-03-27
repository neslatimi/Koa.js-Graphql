module.exports = {
    delete: `
    mutation($id: String!) {
      deleteEvent( id:$id)
    }`,
    create: `
    mutation createEvent($title: String!, $start: String!, $end: String!, $allDay: Boolean!){
        createEvent(title: $title, start: $start, end:$end, allDay:$allDay) 
        {
          id
          title
          allDay
          start
          end
        }
      }
    `,
    update: `
    mutation ($id: String!, $title: String!, $start: String!, $end: String!, $allDay: Boolean!){
      updateEvent(id:$id, title: $title, start: $start, end: $end, allDay: $allDay ){
          id
          title
          allDay
          start
          end
      }
    }`
}