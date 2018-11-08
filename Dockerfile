FROM node:8.11.4

RUN apt-get update

#
# Create working directory and copy project into it
#
WORKDIR /myApp
ADD . /myApp

# 
# Download Package dependencies and run app...
RUN npm install
EXPOSE 3000
CMD npm start
