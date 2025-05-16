# Projet_SOA_Sem2
# 🛡️ Content Moderation & Classification Microservice System

Ce projet est une architecture distribuée de microservices permettant la **modération**, la **classification** et la **détection de spam** pour du contenu textuel. Il intègre **GraphQL**, **gRPC**, **Kafka**, **Express**, et **Docker** pour un traitement en temps réel.

---

## 📚 Fonctionnalités

- 🔍 **Modération de contenu** (détection de toxicité)
- 🧠 **Classification thématique** (politique, technologie, santé, etc.)
- 🚫 **Détection de spam**
- 🔗 Communication interservices via **gRPC**
- 📬 Notifications via **Kafka**
- 🌐 API Gateway exposée en **GraphQL** et **REST**
- 🐳 Dockerisation complète

---

## 🗂️ Structure du projet

```bash
Projet_SOA_Sem2/
│
├── gateway/               # Point d'entrée (GraphQL & REST)
│   ├── graphql/schema.js  # Schéma GraphQL (typeDefs, resolvers)
│   └── routes/content.js  # Endpoint REST
│
├── moderation-service/    # gRPC Service de modération
│   ├── server.js
│   └── moderation.proto
│
├── classification-service/ # gRPC Service de classification
│   ├── server.js
│   └── classification.proto
│
├── anti-spam-service/     # gRPC Service de détection de spam
│   ├── server.js
│   └── spam.proto
│
├── notification-server/   # Service consommateur Kafka (logs)
│   ├── notify.js
│   └── index.js
│
├── kafka-config/          # Config Kafka (topics, consumer, producer)
│
├── docker-compose.yml     # Lancement de tous les services
└── README.md
