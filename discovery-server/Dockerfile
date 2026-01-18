# Build stage
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app

# Copy the entire project context to satisfy multi-module dependencies
COPY . .

# Build the discovery-server module
RUN mvn clean package -pl discovery-server -am -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Only copy the final executable fat JAR
COPY --from=build /app/discovery-server/target/discovery-server-1.0.0-SNAPSHOT.jar app.jar

EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]
