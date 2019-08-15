import connection from '../../database/connection'

export default {

  handle(event, node) {
    return connection.getPlatformInfo(node.label)
      .then(res1 => {
        connection.searchComponentsByType(node.label)
          .then(res2 => {
            Object.assign(res1, {components: res2})
            connection.getPlatformTE(node.label)
              .then(res3=>{
                Object.assign(res1, {time_event: res3})
                event.sender.send('platform-chart-response', res1)
              })

          })
      })
      .catch(error => {
        console.log(error)
        event.sender.send('platform-chart-response', error)
      })
  }
}
