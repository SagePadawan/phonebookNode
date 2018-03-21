var http = require('http');

var contacts = [
    {first: 'Bolivar', last: 'Trask', email: 'brask@deadmuties.com', id: 0},
    {first: 'Oliver', last: 'Twist', email: 'twoliver@gimmemore.com', id: 1},
    {first: 'Albus', last: 'Dumbledore', email: 'albore@pheonixorder.com', id: 2},
    {first: 'James', last: 'Blake', email: 'jakebrake@limitlove.com', id: 3},
    {first: 'Tony', last: 'Yayo', email: 'iammarvin@gunit.com', id: 4}
];

var lastId = 4;
//need to generate ids not dependent on previous ids

//finds contacts by id
var findContact = function(id) {
    //sets id var "string" to base 10
    id = parseInt(id, 10);
    //uses array.find method on "contact" and passes in callback function 
    //to return matching id from original "contacts" array
    return contacts.find(function(contact) {
        return contact.id === id;
    });
};


var deleteContact = function(contactToDelete) {
    contacts = contacts.filter(function(contact) {
        return contact !== contactToDelete;
    });
};

var readBody = function(request, callback) {
    var body = '';
    request.on('data', function(chunk) {
        body += chunk.toString();
    });
    request.on('end', function() {
        callback(body);
    });
};

var matches = function(request, method, path) {
    return request.method === method &&
           request.url.startsWith(path);
};

var getSuffix = function(fullUrl, prefix) {
    return fullUrl.slice(prefix.length);
};

var getContacts = function(request, response) {
    response.end(JSON.stringify(contacts));
};

var postContacts = function(request, response) {
    readBody(request, function(body) {
        var contact = JSON.parse(body);
        contact.id = ++lastId;
        console.log(contact);
        contacts.push(contact);
        response.end('Created contact!');
    });
};

var deleteContact = function(request, response) {
    var id = getSuffix(request.url, '/contacts/');
    var contact = findContact(id);
    deleteContact(contact);
    console.log(contact);
    response.end('Deleted contact!');
};

var getContact = function(request, response) {
    var id = getSuffix(request.url, '/contacts/');
    var contact = findContact(id);
    response.end(JSON.stringify(contact));
};

var putContact = function(request, response) {
    var id = getSuffix(request.url, '/contacts/');
    var contact = findContact(id);
    readBody(request, function(body) {
        var newParams = JSON.parse(body);
        Object.assign(contact, newParams);
        response.end('Updated contact!');
    });
};

var notFound = function(request, response) {
    response.statusCode = 404;
    response.end('404, nothing here!');
};

var routes = [
    { method: 'DELETE', path: '/contacts/', handler: deleteContact },
    { method: 'GET', path: '/contacts/', handler: getContact },
    { method: 'PUT', path: '/contacts/', handler: putContact },
    { method: 'GET', path: '/contacts', handler: getContacts },
    { method: 'POST', path: '/contacts', handler: postContacts },
];

var server = http.createServer(function(request, response) {
    console.log(request.method, request.url);

    var route = routes.find(function(route) {    
        return matches(request, route.method, route.path);
    });

    (route ? route.handler : notFound)(request, response);

    // var foundMatch = false;
    // for (var i = 0; i < routes.length; i++) {
    //     var route = routes[i];
    //     if (matches(request, route.method, route.path)) {
    //         route.handler(request, response);
    //         foundMatch = true;
    //         break;
    //     }
    // }

    // if (!foundMatch) {
    //     notFound(request, response);
    // }

    // if (matches(request, 'POST', '/contacts')) {
    //     postContacts(request, response);
    // } else if (matches(request, 'DELETE', '/contacts/')) {
    //     deleteContacts(request, response);
    // } else if (matches(request, 'GET', '/contacts/')) {
    //     getContact(request, response);
    // } else if (matches(request, 'PUT', '/contacts/')) {
    //     putContact(request, response);
    // } else if (matches(request, 'GET', '/contacts')) {
    //     getContacts(request, response);
    // } else {
    //     notFound(request, response);
    // }
});

server.listen(3000);