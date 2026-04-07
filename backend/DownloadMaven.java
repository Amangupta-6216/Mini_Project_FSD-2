import java.io.*;
import java.net.URL;
import java.nio.file.*;
import java.util.zip.*;

public class DownloadMaven {
    public static void main(String[] args) throws Exception {
        String mavenUrl = "https://dlcdn.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip";
        Path zipPath = Paths.get("maven.zip");
        Path extractDir = Paths.get("maven-install");

        System.out.println("Downloading Maven...");
        try (InputStream in = new URL(mavenUrl).openStream()) {
            Files.copy(in, zipPath, StandardCopyOption.REPLACE_EXISTING);
        }

        System.out.println("Extracting Maven...");
        Files.createDirectories(extractDir);
        try (ZipInputStream zis = new ZipInputStream(Files.newInputStream(zipPath))) {
            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                Path dest = extractDir.resolve(entry.getName());
                if (entry.isDirectory()) {
                    Files.createDirectories(dest);
                } else {
                    Files.createDirectories(dest.getParent());
                    Files.copy(zis, dest, StandardCopyOption.REPLACE_EXISTING);
                }
            }
        }

        // Create maven wrapper script for cmd
        String mvnCmdContent = "@echo off\r\n" +
                "set MAVEN_HOME=\"%~dp0maven-install\\apache-maven-3.9.6\"\r\n" +
                "cmd /c %MAVEN_HOME%\\bin\\mvn.cmd %*\r\n";
        Files.write(Paths.get("mvnw.cmd"), mvnCmdContent.getBytes());

        Files.delete(zipPath);
        System.out.println("\nSUCCESS! Maven is installed locally.");
        System.out.println("You can now run: .\\mvnw.cmd spring-boot:run");
    }
}
