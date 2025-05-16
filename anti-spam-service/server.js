const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const detectSpam = require('./spam');

const PROTO_PATH = path.join(__dirname, '../protos/spam.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const spamService = protoDescriptor.SpamService;

function detectSpamHandler(call, callback) {
  try {
    const { content } = call.request;
    
    if (!content) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'Content is required'
      });
      return;
    }

    const result = detectSpam(content);
    callback(null, {
      isSpam: result.isSpam,
      reason: result.reason
    });
  } catch (error) {
    console.error('Error in detectSpamHandler:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Internal server error'
    });
  }
}

function startServer() {
  const server = new grpc.Server();
  server.addService(spamService.service, {
    detectSpam: detectSpamHandler
  });
  
  const port = process.env.PORT || 50056;
  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
      console.error('Failed to bind server:', error);
      return;
    }
    server.start();
    console.log(`gRPC server running on port ${port}`);
  });
}

startServer();
