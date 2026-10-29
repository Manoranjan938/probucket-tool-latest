# Build the jar from source
FROM maven:3.8.8-eclipse-temurin-17 as builder
WORKDIR /build
COPY pom.xml .
RUN --mount=type=cache,target=/root/.m2 mvn -B dependency:go-offline
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -B -DskipTests package \
    && cp target/*.jar app.jar \
    && java -Djarmode=layertools -jar app.jar extract --destination /extracter

FROM eclipse-temurin:17-jre
WORKDIR /application
COPY --from=builder /extracter/dependencies/ ./
COPY --from=builder /extracter/spring-boot-loader/ ./
COPY --from=builder /extracter/snapshot-dependencies/ ./
COPY --from=builder /extracter/application/ ./
EXPOSE 9025
ENTRYPOINT [ "java", "org.springframework.boot.loader.JarLauncher" ]
