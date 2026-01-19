FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy the pre-built JAR from your local target folder
COPY course-service/target/*.jar app.jar
EXPOSE 10000
ENTRYPOINT ["java", "-jar", "app.jar"]
