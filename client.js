const PROTO_PATH = './messages.proto';
const grpc = require('grpc');
const fs = require('fs');
const users = require('./user');
const user = grpc.load(PROTO_PATH).user;

const PORT = 9000;
const client = new user.UserService("localhost:9000", grpc.credentials.createInsecure());

const option = parseInt(process.argv[2], 10);

switch(option)  {
    case 1: {
        getUserById(client);
        break;
    }
    case 2: {
        getAll(client);
        break;
    }
    case 3: {
        uploadFile(client);
        break;
    }
}


function getUserById(client) {
    const md = grpc.Metadata({hj : 'dfsfdsfsd'});
    client.getUserById({ id: 123 },  md,  (err, response) => {
        if (err) {
            console.log(err);
        }  else {
            console.log('response: ', response);
        }
    });
}

function getAll(client) {
    const call = client.getAll();
    call.on('data', (data) => {
        console.log(data);
    });

    call.on('end', () => {
        console.log('data streaming from server completed');
    });
}

function uploadFile(client) {
    const call = client.uploadFile();
    call.on('data', (data) => console.log(data));
    users.forEach(u => call.write(u));
    call.on('end', () => console.log('data streaming ended from server'));
}