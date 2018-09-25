var dav = require('dav');

var client = new dav.Client(
  new dav.transport.Basic(
    new dav.Credentials({
      username: 'lovika@dieseldispatch.com',
      password: 'password'
    })
  ),
  {
    baseUrl: 'https://mail.zoho.com'
  }
);

let account = dav.createAccount({
    server: 'http://127.0.0.1:8888/',
    xhr: xhr,
    loadObjects: true
  });

var req = dav.request.basic({
  method: 'PUT',
  data: 'BEGIN:VCALENDAR\nEND:VCALENDAR',
  etag: '12345'
});

// req instanceof dav.Request

client.send(req, '/calendars/123.ics')
.then(function(response) {
  // response instanceof XMLHttpRequest
});