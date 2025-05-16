// =====================
# Content Moderation Platform (Microservices)

## Description
Plateforme de modération et classification de contenu en temps réel utilisant :
- REST (Express.js)
- GraphQL (Apollo Server)
- gRPC (modération/classification)
- Kafka (communication interservices)

## Microservices
- **Gateway** : Entrée REST & GraphQL
- **Moderation Service** : Analyse de toxicité via gRPC
- **Classification Service** : Catégorisation du contenu via gRPC
- **Notification Service** : Kafka consumer pour suivi des résultats

## Exécution
Utiliser Docker Compose avec Zookeeper, Kafka et les services Node.js

```bash
docker-compose up --build
```

## Dossier `protos`
Contient les fichiers `moderation.proto` et `classification.proto`

## Dossier `kafka-config`
Contient les producteurs et consommateurs Kafka réutilisables

## Routes REST
- `POST /api/submit` : envoie du contenu

## Requêtes GraphQL
```graphql
mutation {
  submitContent(content: "example") {
    moderation { isToxic score }
    classification { category }
  }
}
```

## Auteur
