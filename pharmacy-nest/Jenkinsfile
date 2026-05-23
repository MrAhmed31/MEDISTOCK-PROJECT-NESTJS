pipeline {
    agent any

    stages {

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t pharmacy-nest-app .'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh 'docker stop pharmacy-nest-container || true'
                sh 'docker rm pharmacy-nest-container || true'
            }
        }

        stage('Run New Container') {
            steps {
                sh 'docker run -d -p 3000:3000 --name pharmacy-nest-container pharmacy-nest-app'
            }
        }
    }
}