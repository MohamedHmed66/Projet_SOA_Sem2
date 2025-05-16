const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger le fichier .proto
const packageDef = protoLoader.loadSync(__dirname + '/../protos/moderation.proto');
const proto = grpc.loadPackageDefinition(packageDef);

// Logique de détection toxique améliorée
function ModerateContent(call, callback) {
  const { content } = call.request;
  const toxicWords = ['badword', 'stupid', 'idiot', 'nonsense', 'shut up', 'trash', 'hate'];
  const lower = content.toLowerCase();
  const isToxic = toxicWords.some(word => lower.includes(word));
  const score = isToxic ? 0.9 : 0.1;
  callback(null, { isToxic, score });
}

// Création et démarrage du serveur gRPC
const server = new grpc.Server();
server.addService(proto.ModerationService.service, { ModerateContent });

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error('Error binding server:', error);
    return;
  }
  console.log(`Moderation service running on port ${port}`);
});
