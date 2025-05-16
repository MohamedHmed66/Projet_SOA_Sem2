const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger le fichier proto
const packageDef = protoLoader.loadSync(__dirname + '/../protos/classification.proto');
const proto = grpc.loadPackageDefinition(packageDef);

// Créer le client
const client = new proto.ClassificationService(
  'localhost:50052',
  grpc.credentials.createInsecure()
);

// Fonction pour tester la classification
function testClassification(content) {
  return new Promise((resolve, reject) => {
    client.ClassifyContent({ content }, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

// Tests
async function runTests() {
  const testCases = [
    { content: "This is a political article about elections", expected: "politics" },
    { content: "New technology in AI development", expected: "technology" },
    { content: "Health tips for better living", expected: "health" },
    { content: "General news about weather", expected: "general" }
  ];

  console.log("Starting classification tests...\n");

  for (const test of testCases) {
    try {
      const result = await testClassification(test.content);
      const passed = result.category === test.expected;
      console.log(`Test: "${test.content}"`);
      console.log(`Expected: ${test.expected}`);
      console.log(`Got: ${result.category}`);
      console.log(`Result: ${passed ? " PASSED" : " FAILED"}\n`);
    } catch (error) {
      console.error(`Error testing "${test.content}":`, error.message);
    }
  }
}

// Exécuter les tests
runTests(); 