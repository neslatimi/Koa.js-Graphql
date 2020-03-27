module.exports = {
    list: `
    {
        listEvents {
            id
            title
            allDay
            start
            end
        }
    }`,
    listOne: `
    query ($id: String!){
    listEventOne(id: $id)
    {
        id
        title
        allDay
        start
        end
    }  
    }
    `

}