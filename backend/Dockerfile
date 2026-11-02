# Build the jar from source
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build
COPY pom.xml .
RUN --mount=type=cache,target=/root/.m2 mvn -B dependency:go-offline
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -B -DskipTests package \
    && cp target/*.jar app.jar \
    && java -Djarmode=tools -jar app.jar extract --layers --destination /extracter

FROM eclipse-temurin:21-jre
WORKDIR /application
COPY --from=builder /extracter/dependencies/ ./
COPY --from=builder /extracter/spring-boot-loader/ ./
COPY --from=builder /extracter/snapshot-dependencies/ ./
COPY --from=builder /extracter/application/ ./
EXPOSE 9025
ENTRYPOINT [ "java", "-jar", "app.jar" ]
