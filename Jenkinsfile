pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'praveenkmr841'
        DOCKER_IMAGE = 'react-app'
        KUBERNETES_NAMESPACE = 'default'
        DOCKER_CREDENTIALS = credentials('docker-credentials')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    def dockerImage = docker.build("${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${BUILD_NUMBER}")
                    
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-credentials') {
                        dockerImage.push()
                        dockerImage.push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Update the image tag in the deployment file
                    sh """
                        sed -i 's|image: .*|image: ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${BUILD_NUMBER}|' kubernetes/deployment.yaml
                        kubectl apply -f kubernetes/deployment.yaml -n ${KUBERNETES_NAMESPACE}
                    """
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
} 