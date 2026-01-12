# This is a Master Dockerfile for the Multi-Tenant LMS
# To build a specific module, use: 
# docker build --build-arg MODULE=user-service -t user-service .

ARG MODULE=api-gateway

# Build stage
FROM maven:3.8.4-openjdk-17-slim AS build
ARG MODULE
WORKDIR /app
COPY pom.xml .
COPY ${MODULE}/pom.xml ${MODULE}/
COPY ${MODULE}/src ${MODULE}/src
RUN mvn -pl ${MODULE} clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
ARG MODULE
WORKDIR /app
COPY --from=build /app/${MODULE}/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
