# Build Stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY discovery-server/pom.xml discovery-server/pom.xml
COPY api-gateway/pom.xml api-gateway/pom.xml
COPY user-service/pom.xml user-service/pom.xml
COPY course-service/pom.xml course-service/pom.xml
COPY assessment-service/pom.xml assessment-service/pom.xml
COPY notification-service/pom.xml notification-service/pom.xml
COPY attendance-service/pom.xml attendance-service/pom.xml
COPY leave-service/pom.xml leave-service/pom.xml

# Download dependencies (caching layer)
RUN mvn dependency:go-offline -B

# Copy source code
COPY discovery-server/src discovery-server/src
COPY api-gateway/src api-gateway/src
COPY user-service/src user-service/src
COPY course-service/src course-service/src
COPY assessment-service/src assessment-service/src
COPY notification-service/src notification-service/src
COPY attendance-service/src attendance-service/src
COPY leave-service/src leave-service/src

# Build the specific module
RUN mvn package -DskipTests -pl user-service -am

# Run Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/user-service/target/*.jar app.jar
EXPOSE 10000
ENTRYPOINT ["java", "-jar", "app.jar"]
