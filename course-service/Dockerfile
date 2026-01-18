FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy the pre-built JAR from your local target folder
COPY target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
