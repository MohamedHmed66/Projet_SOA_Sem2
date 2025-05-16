const { gql } = require('apollo-server-express');
const grpc = require('../services/grpcClient');
const kafkaProducer = require('../services/kafkaProducer');

const typeDefs = gql`
  type Moderation {
    isToxic: Boolean
    score: Float
  }
  type Classification {
    category: String
  }
  type SpamResult {
    isSpam: Boolean!
    reason: String
  }
  type Result {
    spam: SpamResult
    moderation: Moderation
    classification: Classification
    validationMessage: String
  }
  type Query {
    hello: String
  }
  type Mutation {
    submitContent(content: String!): Result
    checkSpam(content: String!): SpamResult!
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL',
  },
  Mutation: {
    submitContent: async (_, { content }) => {
      const spam = await grpc.spam(content);
      let validationMessage = "";

      if (spam.isSpam) {
        validationMessage = "Attention : c'est un spam";
        await kafkaProducer.publish('validation-results', { content, validationMessage });
        await kafkaProducer.publish('spam-results', { content, ...spam });
        return { spam, moderation: null, classification: null, validationMessage };
      }

      const moderation = await grpc.moderate(content);
      if (moderation.isToxic) {
        validationMessage = "Attention : c'est toxique";
        await kafkaProducer.publish('validation-results', { content, validationMessage });
        await kafkaProducer.publish('moderation-results', { content, ...moderation });
        return { spam, moderation, classification: null, validationMessage };
      }

      const classification = await grpc.classify(content);
      validationMessage = "Tu peux valider cette publication";
      await kafkaProducer.publish('validation-results', { content, validationMessage });
      await kafkaProducer.publish('moderation-results', { content, ...moderation });
      await kafkaProducer.publish('classification-results', { content, ...classification });

      return { spam, moderation, classification, validationMessage };
    },
    checkSpam: async (_, { content }) => {
      return grpc.spam(content);
    }
  },
};

module.exports = { typeDefs, resolvers };