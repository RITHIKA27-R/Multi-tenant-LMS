FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy the pre-built JAR from your local target folder
COPY api-gateway/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
