# syntax=docker/dockerfile:1
FROM ubuntu:latest

# install app dependencies
RUN apt-get update
RUN apt-get install -y python3 python3-pip
RUN apt install g++
RUN pip install django

COPY . .

EXPOSE 8000
CMD python3 manage.py runserver 0.0.0.0:8000 
