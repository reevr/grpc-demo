const PROTO_PATH = './messages.proto';
const grpc = require('grpc');

const user = grpc.load(PROTO_PATH).user;

const PORT = 9000;

const server = new grpc.Server();
const users = require('./user');

server.addService(user.UserService.service, {
    GetUserById: getUserById,
    GetAll: getAll
});

server.bind("0.0.0.0:9000", grpc.ServerCredentials.createInsecure());
server.start();
console.log('server started at : 9000');

function getAll(call) {
    users.forEach(user => call.write({
        user: user
    }));
    call.end();
}

function getUserById(call, callback) {
    const  id = call.request.id;
    const user = users.find(user => user.id == id);
    return callback(null, {
        user: user
    });
}