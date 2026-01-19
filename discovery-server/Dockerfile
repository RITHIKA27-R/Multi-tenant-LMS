FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy the pre-built JAR from your local target folder
COPY discovery-server/target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]
