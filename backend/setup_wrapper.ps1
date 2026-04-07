Invoke-WebRequest -Uri "https://start.spring.io/starter.zip?type=maven-project&language=java&bootVersion=3.4.0&baseDir=wrapper" -OutFile wrapper.zip
Expand-Archive wrapper.zip -DestinationPath . -Force
Move-Item -Path "wrapper\.mvn" -Destination "." -Force
Move-Item -Path "wrapper\mvnw*" -Destination "." -Force
Remove-Item -Recurse -Force "wrapper"
Remove-Item -Force "wrapper.zip"
Write-Output "Maven Wrapper successfully installed."
