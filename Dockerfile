# Use an official Maven image to build the backend
FROM maven:3.8.4-openjdk-11 AS build
WORKDIR /app
COPY . .
RUN mvn clean install -DskipTests

# Use JBoss as the runtime
FROM jboss/wildfly:latest
WORKDIR /opt/jboss/wildfly/standalone/deployments/
COPY --from=build /app/target/appcontratos-0.0.1-SNAPSHOT.jar ./appcontratos.war

# Run the application
CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0"]
