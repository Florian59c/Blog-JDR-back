# Utiliser l'image officielle MariaDB
FROM mariadb:latest

# Configuration du mot de passe root et du nom de la base de données par défaut
ENV MYSQL_ROOT_PASSWORD=root_password
ENV MYSQL_DATABASE=monprojet1
ENV MYSQL_USER=user1
ENV MYSQL_PASSWORD=password1

# Exposer le port par défaut de MariaDB
EXPOSE 3306
