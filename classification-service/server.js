const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger le fichier .proto de classification
const packageDef = protoLoader.loadSync(__dirname + '/../protos/classification.proto');
const proto = grpc.loadPackageDefinition(packageDef);

// Fonction de classification du contenu
function ClassifyContent(call, callback) {
  const { content } = call.request;
  let category = 'general';

  const lower = content.toLowerCase();
  if (/politic/i.test(lower)) category = 'politics';
  else if (/tech|ai|code/i.test(lower)) category = 'technology';
  else if (/health|medicine/i.test(lower)) category = 'health';

  callback(null, { category });
}

// Création et démarrage du serveur gRPC
const server = new grpc.Server();
server.addService(proto.ClassificationService.service, { ClassifyContent });

server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error('Error binding server:', error);
    return;
  }
  console.log(`Classification service running on port ${port}`);
});
