APIs 4 Harness project
------

This repository contains the APIs 4 Harness project. It provides a quick way to consume OCI REST APIs to list, stop and start OCI resources. 

Containerise APIs 4 Harness Application
------

   - Ensure you have installed Vagrant on your laptop/PC. If you need help, [read this blog](https://redthunder.blog/2018/02/13/teaching-how-to-use-vagrant-to-simplify-building-local-dev-and-test-environments/). 

   - Download or Git clone this Github repo: 

			git clone https://github.com/solutionsanz/apis4harness

   - In a terminal window, change directory to where you cloned/downloaded the repository (APIs 4 Harness) – Notice that the Vagrantfile is already in there.

   - Start up your Vagrant Dev VM:

	        vagrant up

   - A new Ubuntu VM will be provisioned and a bootstrap script will install all required utilities (e.g. docker).
    
   - You can now **vagrant ssh** into the Virtual Machine.

            vagrant ssh

   - Go to your working directory (mounted from host OS - shred folder).

            cd /vagrant

   - Use **setEnv_template** as a reference and create a new file. Called it **setEnv** - In there, set the properties of your OCI environment. If you need help to bring the parameters, [read this reference](https://docs.cloud.oracle.com/iaas/Content/General/Concepts/credentials.htm) or feel free to drop me a question via [LinkedIn](https://www.linkedin.com/in/citurria/). 

        - **Note:** Remember that the public key finger print comes from importing a PEM Public key into the user that you wish to use to invoke the OCI APIs.
            
   - Switch user to **ubuntu**

            sudo su ubuntu

   - Containerise the application by using the provided Dockerfile:

            docker build .

   - Execute locally your new Docker Image of your Application:

            docker run --env-file setEnv -p 3000:3000 -it [image_id] 

            By default port 3000 was configured as a "Port Forward" by vagrant as part of your VM bootstrap during its creation.

   - Tag the Docker image:

            docker tag [Image_ID] [DockerRepoUsername]/[DockerRepoName]:[version]

            For example:

                docker tag c26c58862548 cciturria/api4harness:1.0

            Note, if you are unsure about the actual "image_id", you can use "docker images" to gather all images being generated.

            Also notice that you could have tagged your Docker image at the moment of “docker building” by using -t [user/repoName]
            

   - In your host OS, open a browser and go to: **http://localhost:3000** - Test your app. 
    
   - Once you feel comfortable with the Docker image, push it to Docker Hub or OCI-R, so that you can run it easily on Oracle Container Engine for Kubernetes (OKE).
   
            Note: I assume that you have already created a repository in your DockerHub or OCI-R, for example: cciturria/apis4harness

            In Vagrant, login to Docker Hub/OCI-R:

            docker login

                Enter docker hub username, password and email.

            docker push [DockerRepoUsername]/[DockerRepoName]

                E.g. docker push cciturria/apis4harness


Deploy APIs 4 Harness application in Kubernetes
------

   - Go to where you have installed and configured **kubectl**.

        Note: [Read this blog](https://redthunder.blog/2018/04/18/teaching-how-to-quickly-provision-a-dev-kubernetes-environment-locally-or-in-oracle-cloud/) if you need assistance to provision Kubernetes.

   - Download or Git clone this Github repo: 

            git clone https://github.com/solutionsanz/apis4harness

   - Go to where you cloned/downloaded the repository

   - Change directory to deploy/kubernetes

            cd deploy/kubernetes

   - Use the template **apis4harness-dpl.yaml_sample** to create a new file **apis4harness-dpl.yaml** - In this file, at the end, set the Docker image tag name (e.g. xxx/apis4harness:1.0) and all the OCI properties that you used in setEnv.

   - Deploy APIs 4 Harness Kubernetes application resources (deployment, service, ingress)

            ./deploy.sh        

   - Open up Kubernetes Dashboard UI or equivalent (e.g. WeaveScope) and validate all APIs 4 Harness resources were deployed successfully.

   - Test your application, open a browser and go to: **http://[YOUR_KUBERNETES_LB]/xxx** - Test your app. 
    
    
If you need any assistance, feel free to [contact me](https://www.linkedin.com/in/citurria/).