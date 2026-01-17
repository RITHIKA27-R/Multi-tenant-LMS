# Build stage
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app

# Copy the root pom first to cache dependencies
COPY pom.xml .
# Copy the api-gateway module
COPY api-gateway/pom.xml api-gateway/
COPY api-gateway/src api-gateway/src

# Build the api-gateway module
RUN mvn clean package -pl api-gateway -am -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Only copy the final executable fat JAR
COPY --from=build /app/api-gateway/target/api-gateway-1.0.0-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
