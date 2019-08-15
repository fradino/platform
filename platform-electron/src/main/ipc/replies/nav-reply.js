import connection from '../../database/connection'

export default {

  handle(event) {

    var countries = ['美国', '日本', '印度', '台湾', '俄罗斯', '韩国']

    countries.forEach(function (value, index) {
      connection.searchByCountry(value)
        .then(response => {
          //console.log(response.results[0].platform_type)

          function f(i) {
            if (i < response.results.length) {
              connection.searchComponentsByType(response.results[i].platform_type)
                .then(res => {
                  Object.assign(response.results[i], {components: res})
                  f(++i)
                })
            } else {
              Object.assign(response, {country: index})
              event.sender.send('nav-data-response', response);
            }
          }

          var num = 0;

          f(num)


        })
        .catch(error => {
          console.log(error)
          event.sender.send('nav-data-response', error)
        })
    })


  }
}
