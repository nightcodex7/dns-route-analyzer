pipeline {
    agent any

    environment {
        DOCKER_REPO = "nightcodex/dns-route-analyzer"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage("Build Docker Images") {
            steps {
                sh """
                    docker build -t $DOCKER_REPO:backend-$IMAGE_TAG ./backend
                    docker build -t $DOCKER_REPO:ai-agent-$IMAGE_TAG ./ai-agent
                    docker build -t $DOCKER_REPO:frontend-$IMAGE_TAG ./frontend
                """
            }
        }

        stage("Login to DockerHub") {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'ncxDocker',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo "\$DOCKER_PASS" | docker login -u "\$DOCKER_USER" --password-stdin
                    """
                }
            }
        }

        stage("Push Docker Images") {
            steps {
                sh """
                    docker push $DOCKER_REPO:backend-$IMAGE_TAG
                    docker push $DOCKER_REPO:ai-agent-$IMAGE_TAG
                    docker push $DOCKER_REPO:frontend-$IMAGE_TAG
                """
            }
        }

        stage("Docker Scout Security Scan") {
            steps {
                sh """
                    docker scout quickview $DOCKER_REPO:backend-$IMAGE_TAG
                    docker scout quickview $DOCKER_REPO:ai-agent-$IMAGE_TAG
                    docker scout quickview $DOCKER_REPO:frontend-$IMAGE_TAG
                """
            }
        }

        stage("Docker Scout CVE Report") {
            steps {
                sh """
                    docker scout cves $DOCKER_REPO:backend-$IMAGE_TAG
                    docker scout cves $DOCKER_REPO:ai-agent-$IMAGE_TAG
                    docker scout cves $DOCKER_REPO:frontend-$IMAGE_TAG
                """
            }
        }

        // For Old Docker Compose Deployment
        // stage("Deploy with Docker Compose") {
        //     steps {
        //         sh """
        //             docker-compose down || true
        //             docker-compose up -d
        //         """
        //     }
        // }

        For Docker Swarm Deployment
        stage("Deploy to Docker Swarm") {
            steps {
                sh """
                    docker stack deploy -c docker-compose.yml dnsstack
                """
            }
        }
    }
}