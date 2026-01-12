# Build stage
FROM maven:3.8.4-openjdk-17-slim AS build
ARG MODULE=api-gateway
WORKDIR /app

# 1. Copy the parent pom
COPY pom.xml .

# 2. Copy all module poms (satisfies Maven's multi-module check without copying all source code)
COPY discovery-server/pom.xml discovery-server/
COPY api-gateway/pom.xml api-gateway/
COPY user-service/pom.xml user-service/
COPY course-service/pom.xml course-service/
COPY assessment-service/pom.xml assessment-service/
COPY notification-service/pom.xml notification-service/
COPY attendance-service/pom.xml attendance-service/
COPY leave-service/pom.xml leave-service/

# 3. Copy the actual source of the module we want to build
COPY ${MODULE}/src ${MODULE}/src

# 4. Build the specific module
RUN mvn -pl ${MODULE} clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
ARG MODULE=api-gateway
WORKDIR /app
# Note: we use a wildcard because the JAR name might vary slightly by version
COPY --from=build /app/${MODULE}/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
