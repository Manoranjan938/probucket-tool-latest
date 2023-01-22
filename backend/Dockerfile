FROM eclipse-temurin:17.0.4.1_1-jre as builder
WORKDIR /extracter
ADD target/*.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

FROM eclipse-temurin:17.0.4.1_1-jre
WORKDIR /application
COPY --from=builder /extracter/dependencies/ ./
COPY --from=builder /extracter/spring-boot-loader/ ./
COPY --from=builder /extracter/snapshot-dependencies/ ./
COPY --from=builder /extracter/application/ ./
EXPOSE 8080
ENTRYPOINT [ "java", "org.springframework.boot.loader.JarLauncher" ]