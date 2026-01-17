# Build stage
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app

# Copy the root pom first to cache dependencies
COPY pom.xml .
# Copy the user-service module
COPY user-service/pom.xml user-service/
COPY user-service/src user-service/src

# Build the user-service module
RUN mvn clean package -pl user-service -am -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Only copy the final executable fat JAR
COPY --from=build /app/user-service/target/user-service-1.0.0-SNAPSHOT.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
