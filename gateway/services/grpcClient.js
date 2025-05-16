const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const moderationDef = protoLoader.loadSync(__dirname + '/../../protos/moderation.proto');
const classificationDef = protoLoader.loadSync(__dirname + '/../../protos/classification.proto');
const spamDef = protoLoader.loadSync(__dirname + '/../../protos/spam.proto');
const moderationProto = grpc.loadPackageDefinition(moderationDef).ModerationService;
const classificationProto = grpc.loadPackageDefinition(classificationDef).ClassificationService;
const spamProto = grpc.loadPackageDefinition(spamDef).SpamService;

const moderationClient = new moderationProto('localhost:50051', grpc.credentials.createInsecure());
const classificationClient = new classificationProto('localhost:50052', grpc.credentials.createInsecure());
const spamClient = new spamProto('localhost:50056', grpc.credentials.createInsecure());

module.exports = {
  moderate: (content) => new Promise((resolve, reject) => {
    moderationClient.ModerateContent({ content }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  }),
  classify: (content) => new Promise((resolve, reject) => {
    classificationClient.ClassifyContent({ content }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  }),
  spam: (content) => new Promise((resolve, reject) => {
    spamClient.DetectSpam({ content }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  }),
};