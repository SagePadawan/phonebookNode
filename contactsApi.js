const http = require('http');

let contacts = [
    {first: 'Bolivar', last: 'Trask', email: 'brask@deadmuties.com', id: 0},
    {first: 'Oliver', last: 'Twist', email: 'twoliver@gimmemore.com', id: 1},
    {first: 'Albus', last: 'Dumbledore', email: 'albore@pheonixorder.com', id: 2},
    {first: 'James', last: 'Blake', email: 'jakebrake@limitlove.com', id: 3},
    {first: 'Tony', last: 'Yayo', email: 'iammarvin@gunit.com', id: 4}
];

let lastId = 4;
//need to generate ids not dependent on previous ids

//finds contacts by id
let findContact = id => {
    //sets id var "string" to base 10
    id = parseInt(id, 10);
    //uses array.find method on "contact" and passes in callback function 
    //to return matching id from original "contacts" array
    return contacts.find(function(contact) {
        return contact.id === id;
    });
};


let deleteContact = contactToDelete => {
    contacts = contacts.filter(contact => {
        return contact !== contactToDelete;
    });
};

let readBody = (request, callback) => {
    var body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });
    request.on('end', () => {
        callback(body);
    });
};

let matches = (request, method, path) => {
    return request.method === method &&
           request.url.startsWith(path);
};

let getSuffix = (fullUrl, prefix) => {
    return fullUrl.slice(prefix.length);
};

let getContacts = (request, response) => {
    response.end(JSON.stringify(contacts));
};

let postContacts = (request, response) => {
    readBody(request, function(body) {
        var contact = JSON.parse(body);
        contact.id = ++lastId;
        console.log(contact);
        contacts.push(contact);
        response.end('Created contact!');
    });
};

let deleteContactById = (request, response) => {
    var id = getSuffix(request.url, '/contacts/');
    var contact = findContact(id);
    deleteContact(contact);
    console.log(contact);
    response.end('Deleted contact!');
};

let getContact = (request, response) => {
    var id = getSuffix(request.url, '/contacts/');
    var contact = findContact(id);
    response.end(JSON.stringify(contact));
};

let addContact = (request, response) => {
    var id = getSuffix(request.url, '/contacts/');
    var contact = findContact(id);
    readBody(request, body => {
        var newParams = JSON.parse(body);
        Object.assign(contact, newParams);
        response.end('Updated contact!');
    });
};

let notFound = (request, response) => {
    response.statusCode = 404;
    response.end('404, nothing here!');
};

var routes = [
    { method: 'DELETE', path: '/contacts/', handler: deleteContact },
    { method: 'GET', path: '/contacts/', handler: getContact },
    { method: 'PUT', path: '/contacts/', handler: addContact },
    { method: 'GET', path: '/contacts', handler: getContacts },
    { method: 'POST', path: '/contacts', handler: postContacts },
];

let server = http.createServer(function(request, response) {
    console.log(request.method, request.url);

    var route = routes.find(function(route) {    
        return matches(request, route.method, route.path);
    });

    (route ? route.handler : notFound)(request, response);
});

server.listen(3000);