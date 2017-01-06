package dk.au.cs.casa.jer;

import com.google.gson.Gson;
import com.spotify.docker.client.DefaultDockerClient;
import com.spotify.docker.client.DockerClient;
import com.spotify.docker.client.messages.ContainerConfig;
import com.spotify.docker.client.messages.ContainerCreation;
import com.spotify.docker.client.messages.HostConfig;

import java.awt.*;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.StandardOpenOption;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import static java.lang.String.format;

/**
 * Produces a log file
 */
public class Logger {

    private static String tempDirectoryPrefix = Logger.class.getCanonicalName();

    private final Path root;

    private final Path rootRelativeMain;

    private final Path instrumentationDir;

    private final Path temp;

    private final Path analysis;

    private final Path node;

    private final Path jjs;

    private final Path jalangilogger;

    private final List<Path> preambles;

    private final Optional<Set<Path>> onlyInclude;

    private final int instrumentationTimeLimit;

    private final int timeLimit;

    private final Environment environment;

    private Metadata metadata;

    /**
     * Produces a log file for the run of a main file in a directory
     */
    public Logger(Path root, Path rootRelativeMain, List<Path> preambles, Optional<Set<Path>> onlyInclude, int instrumentationTimeLimit, int timeLimit, Environment environment, Path node, Path jalangilogger, Path jjs, Metadata metadata) {
        if (rootRelativeMain.isAbsolute()) {
            throw new IllegalArgumentException("rootRelativeMain must be relative");
        }

        if (environment == Environment.BROWSER && isJsFile(rootRelativeMain)) {
            this.rootRelativeMain = createHTMLWrapper(root, rootRelativeMain, preambles);
        } else {
            this.rootRelativeMain = rootRelativeMain;
        }

        checkAbsolutePreambles(preambles);
        this.metadata = metadata;
        this.jjs = jjs;
        this.environment = environment;
        this.instrumentationTimeLimit = instrumentationTimeLimit;
        this.timeLimit = timeLimit;
        this.preambles = preambles;
        this.onlyInclude = onlyInclude;
        this.root = root;
        this.node = node;
        this.jalangilogger = jalangilogger;
        try {
            this.temp = createTempDirectory().toRealPath();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        this.instrumentationDir = temp.resolve("instrumentation");
        this.analysis = jalangilogger.resolve("logger/src/ValueLogger.js").toAbsolutePath();
    }

    /**
     * Produces a log file for the run of a single main file
     */
    public static Logger makeLoggerForIndependentMainFile(Path main, List<Path> preambles, Optional<Set<Path>> onlyInclude, int instrumentationTimeLimit, int timeLimit, Environment environment, Path node, Path jalangilogger, Path jjs) {
        Path root = isolateInNewRoot(main);
        Path rootRelativeMain = root.relativize(root.resolve(main.getFileName()));
        return makeLoggerForDirectoryWithMainFile(root, rootRelativeMain, preambles, onlyInclude, instrumentationTimeLimit, timeLimit, environment, node, jalangilogger, jjs);
    }

    public static Logger makeLoggerForDirectoryWithMainFile(Path root, Path rootRelativeMain, List<Path> preambles, Optional<Set<Path>> onlyInclude, int instrumentationTimeLimit, int timeLimit, Environment environment, Path node, Path jalangilogger, Path jjs) {
        return new Logger(root, rootRelativeMain, preambles, onlyInclude, instrumentationTimeLimit, timeLimit, environment, node, jalangilogger, jjs, initMeta(root, rootRelativeMain.getFileName(), environment, getEnvironmentVersion(environment, node), timeLimit));
    }

    private static String getEnvironmentVersion(Environment environment, Path node) {
        if (environment == Environment.NODE || environment == Environment.NODE_GLOBAL) {
            String nodeVersion = getFirstStdOutLine(node, "--version");
            return nodeVersion;
        }
        return "?"; // TODO support more version schemes
    }

    private static String getFirstStdOutLine(Path bin, String arg) {
        boolean debug = false;
        String[] cmd = new String[]{bin.toAbsolutePath().toString(), arg};
        try {
            if (debug) {
                System.out.printf("Executing: %s\n", String.join(" ", cmd));
            }
            final ProcessBuilder pb = new ProcessBuilder(cmd);
            Process process = pb.start();
            BufferedReader brStd = new BufferedReader(new InputStreamReader(process.getInputStream()));
            BufferedReader brErr = new BufferedReader(new InputStreamReader(process.getErrorStream()));

            String lineStd;
            String lineErr = null;
            List<String> lineStds = new ArrayList<>();
            List<String> lineErrs = new ArrayList<>();
            while ((lineStd = brStd.readLine()) != null || (lineErr = brErr.readLine()) != null) {
                PrintStream stream;
                String line;
                if (lineStd != null) {
                    stream = System.out;
                    line = lineStd;
                    lineStds.add(lineStd);
                } else {
                    stream = System.err;
                    line = lineErr;
                    lineErrs.add(lineErr);
                }
                if (debug) {
                    stream.printf("Process ::: %s%n", line);
                }
            }
            process.waitFor();
            if (process.exitValue() != 0) {
                throw new RuntimeException("Process exited with exit code: " + process.exitValue());
            }
            if (lineStds.size() != 1) {
                throw new RuntimeException("Unexpected output from process: " + lineStds);
            }
            return lineStds.get(0);
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    private static Path createTempDirectory() throws IOException {
        return Files.createTempDirectory(tempDirectoryPrefix);
    }

    /**
     * Isolates a single file in a new empty directory. Relative paths behave as before.
     *
     * @return the new root directory
     */
    private static Path isolateInNewRoot(Path main) {
        try {
            Path newRoot = createTempDirectory();
            Path isolated = newRoot.resolve(main.getFileName());
            Files.copy(main, isolated);
            return newRoot;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static Path createHTMLWrapper(Path root, Path rootRelativeMain, List<Path> preambles) {
        List<Path> scriptSources = new ArrayList<>();
        scriptSources.addAll(preambles);
        scriptSources.add(rootRelativeMain);
        List<String> HTMLWrap = new ArrayList<>();
        HTMLWrap.addAll(Arrays.asList(
                "<!DOCTYPE html>",
                "<html>",
                "<head>",
                "</head>",
                "<body>"
        ));
        HTMLWrap.addAll(scriptSources.stream()
                .map(source -> String.format("<script src=\"%s\"></script>", source))
                .collect(Collectors.toList())
        );
        HTMLWrap.addAll(Arrays.asList(
                "</body>",
                "</html>"));
        Path htmlWrapper = root.resolve("jalangilogger_wrapper.html");
        Path htmlWrapperRelative = root.relativize(htmlWrapper);
        try {
            Files.write(htmlWrapper, HTMLWrap, StandardCharsets.UTF_8, StandardOpenOption.CREATE_NEW);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return htmlWrapperRelative;
    }

    private static boolean isJsFile(Path rootRelativeMain) {
        return rootRelativeMain.getFileName().toString().endsWith(".js");
    }

    private static List<String> filterLogFile(Path inputLog) throws IOException {
        List<String> lines = Files.readAllLines(inputLog).stream()
                // TODO find the source of these special-cases!
                .map(String::trim)
                .filter(l -> !l.isEmpty())
                .map(l -> l.startsWith(",") ? l.substring(1) : l)
                .distinct()
                .collect(Collectors.toList());
        return lines;
    }

    private static Metadata initMeta(Path root, Path main, Environment environment, String environmentVersion, int timeLimit) {
        Metadata metadata = new Metadata();
        metadata.setTime(System.currentTimeMillis());
        metadata.setTimeLimit(timeLimit);
        metadata.setRoot(main.toString());
        String hash = HashUtil.shaDirOrFile(root);
        metadata.setSha(hash);
        metadata.setEnvironment(environment.toString());
        metadata.setEnvironmentVersion(environmentVersion);

        // Mini-changelog:
        // 0.1 base
        // 0.2 OtherSymbolDescription, instrumentation-timeout, timeLimit value
        metadata.setLogVersion("0.2");
        return metadata;
    }

    private void checkAbsolutePreambles(List<Path> preambles) {
        for (Path preamble : preambles) {
            if (!preamble.isAbsolute()) {
                throw new IllegalArgumentException(format("Preambles must be absolute %s", preamble));
            }
        }
    }

    private String makeMeta(String result) {
        this.metadata.setResult(result);
        Gson gson = new Gson();
        return gson.toJson(this.metadata.jsonRep);
    }

    private Process exec(Path pwd, String... cmd) throws IOException {
        return exec(pwd, false, cmd);
    }

    private Process exec(Path pwd, boolean redirectOutput, String... cmd) throws IOException {
        ProcessBuilder pb = new ProcessBuilder(cmd);
        if (redirectOutput) {
            pb.redirectOutput(ProcessBuilder.Redirect.INHERIT);
            pb.redirectError(ProcessBuilder.Redirect.INHERIT);
        }
        if (pwd != null) {
            pb.directory(pwd.toFile());
        }
        //pb.redirectOutput(ProcessBuilder.Redirect.INHERIT);
        pb.redirectError(ProcessBuilder.Redirect.INHERIT);
        System.out.printf("Starting (at %s): %s%n", pwd, String.join(" ", Arrays.asList(cmd)));
        Process p = pb.start();
        return p;
    }

    public RawLogFile log() throws IOException {
        return log(true);
    }

    public RawLogFile log(boolean emptyTempDirectoryWhenDone) throws IOException {
        RawLogFile rawLogFile = _log();
        if (emptyTempDirectoryWhenDone) {
            emptyRecursively(this.temp);
        }
        Set<String> badLines = rawLogFile.getLines().stream().filter(l -> l.contains(tempDirectoryPrefix)).collect(Collectors.toSet());
        if (!badLines.isEmpty()) {
            System.err.println("Warning: Produced log that contains semi-bad entries (a likely reference to the tempDirectory):" + badLines);
        }
        return rawLogFile;
    }

    private void emptyRecursively(Path dir) {
        try {
            Files.walkFileTree(dir, new SimpleFileVisitor<Path>() {
                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attrs)
                        throws IOException {
                    delete(file);
                    return FileVisitResult.CONTINUE;
                }

                private void delete(Path file) throws IOException {
                    if (!dir.equals(file)) {
                        Files.delete(file);
                    }
                }

                @Override
                public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
                    if (exc != null) {
                        throw exc;
                    }
                    delete(dir);
                    return FileVisitResult.CONTINUE;
                }
            });
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private RawLogFile _log() throws IOException {
        try {
            if (environment == Environment.NASHORN || environment == Environment.NODE || environment == Environment.NODE_GLOBAL) {
                return new JSLogger(environment).log();
            } else if (environment == Environment.BROWSER) {
                return new HTMLLogger().log();
            } else if (environment == Environment.DRIVEN_BROWSER) {
                return new DrivenHTMLLogger().log();
            }
        } catch (InstrumentationTimeoutException e) {
            return makeInstrumentationTimeoutLog();
        } catch (InstrumentationSyntaxErrorException e) {
            return makeSyntaxErrorLog();
        } catch (InstrumentationException e) {
            throw new RuntimeException(e);
        }
        throw new IllegalArgumentException("Unsupported environment: " + environment);
    }

    private void instrument(Environment environment) throws IOException, InstrumentationSyntaxErrorException, InstrumentationTimeoutException {
        Path instrument_js = jalangilogger.resolve("node_modules/jalangi2").resolve("src/js/commands/instrument.js").toAbsolutePath();
        String script = instrument_js.toString();
        String out = instrumentationDir.toAbsolutePath().toString();
        String in = ".";
        ArrayList<String> cmd = new ArrayList<>(Arrays.asList(node.toString(), script, "--inlineIID", "--analysis", analysis.toString(), "--outputDir", out));
        switch (environment) {
            case DRIVEN_BROWSER:
            case BROWSER:
                cmd.add("--instrumentInline");
                cmd.add("--inlineJalangi");
                break;
            case NASHORN:
                cmd.add("--inlineJalangiAndAnlysesInSingleJSFile");
                break;
            case NODE:
            case NODE_GLOBAL:
                break;
        }
        if (onlyInclude.isPresent()) {
            cmd.add("--only_include");
            List<String> stringPaths = onlyInclude.get().stream()
                    .map(p -> root.relativize(p.toAbsolutePath()))
                    .map(p -> p.toString())
                    .collect(Collectors.toList());
            cmd.add(String.join(":" /* FIXME should be the system separator */, stringPaths));
        }
        cmd.add(in);
        Process exec = exec(root, cmd.toArray(new String[]{}));
        try {
            boolean timedOut = !exec.waitFor(instrumentationTimeLimit, TimeUnit.SECONDS);
            if (timedOut) {
                throw new InstrumentationTimeoutException();
            }
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        String err;
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(exec.getInputStream()))) {
            err = reader.lines().collect(Collectors.joining("\n"));
        }
        if (exec.exitValue() != 0) {
            throw new RuntimeException("Instrumentation failed");
        }
        if (err.contains("SyntaxError")) {
            throw new InstrumentationSyntaxErrorException();
        }
    }

    private List<String> postProcessLog(Path logFile) {
        try {
            List<String> filtered = filterLogFile(logFile);
            List<String> transformed = new LogFileTransformer(root, instrumentationDir, rootRelativeMain).transform(filtered);
            return transformed;
        } catch (IOException e) {
            throw new RuntimeException("Could not post-process the log file", e);
        }
    }

    private void addPreambles(List<String> cmd) {
        for (Path preamble : preambles) {
            cmd.add("--preamble");
            cmd.add(preamble.toString());
        }
    }

    private RawLogFile makeInstrumentationTimeoutLog() throws IOException {
        final List<String> lines = new ArrayList<>();
        lines.add(makeMeta("instrumentation-timeout"));
        lines.addAll(new ArrayList<>());
        return new RawLogFile(lines);
    }

    private RawLogFile makeSyntaxErrorLog() throws IOException {
        final List<String> lines = new ArrayList<>();
        lines.add(makeMeta("syntax-error"));
        lines.addAll(new ArrayList<>());
        return new RawLogFile(lines);
    }

    private RawLogFile makeRawLogFile(String status, Path unprocessedlogFileLocation) {
        final List<String> lines = new ArrayList<>();
        lines.add(makeMeta(status));
        lines.addAll(postProcessLog(unprocessedlogFileLocation));
        return new RawLogFile(lines);
    }

    public enum Environment {
        NODE,
        NODE_GLOBAL,
        NASHORN,
        BROWSER,
        DRIVEN_BROWSER
    }

    private class HTMLLogger {

        private final Path serverDir;

        private final int hardTimeLimit;

        public HTMLLogger() {
            this.serverDir = temp.resolve("server");
            this.hardTimeLimit = (int) (timeLimit * 1.5);
        }

        private void stopServer(Process server) {
            server.destroy();
        }

        private void openBrowser() throws IOException {
            try {
                URI uri = instrumentationDir.resolve(rootRelativeMain).toUri();
                URI uriWithArgument = new URI(uri.getScheme(), uri.getAuthority(), uri.getPath(), null, String.format("softTimeLimit=%d&hardTimeLimit=%d", timeLimit, hardTimeLimit) /* XXX using the fragment part to encode the parameter! This makes browsers work on file-schemed URIs!?!?! */);
                Desktop.getDesktop().browse(uriWithArgument);
            } catch (URISyntaxException e) {
                throw new RuntimeException(e);
            }
        }

        private Process startServer() throws IOException {
            Files.createDirectories(serverDir);
            String[] cmd = new String[]{node.toString(), jalangilogger.resolve("nodeJSServer/bin/www").toString()};
            Process p = exec(serverDir, cmd);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            if (!p.isAlive()) {
                throw new RuntimeException();
            }
            return p;
        }

        public RawLogFile log() throws IOException, InstrumentationException {
            instrument(Environment.BROWSER);
            Process server = startServer();
            try {
                System.out.printf("Press 'p' in the browser when done interacting with the application (or wait for the timeout after %d seconds).%n", timeLimit);
                openBrowser();
                long before = System.currentTimeMillis();
                server.waitFor(hardTimeLimit, TimeUnit.SECONDS);
                long after = System.currentTimeMillis();
                long duration = after - before;
                boolean timedOut = duration > 1000 * hardTimeLimit;
                String status = timedOut ? "timeout" : "success";
                Path logfile = serverDir.resolve("logfile");
                if (!Files.exists(logfile)) {
                    if (!timedOut) {
                        System.err.println("Log file does not exist, but we did not encounter a timeout!?!");
                    }
                    Files.createFile(logfile);
                }
                return makeRawLogFile(status, logfile);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            } finally {
                stopServer(server);
            }
        }

        private void waitForEnter() throws IOException {
            BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
            System.out.printf("Press ENTER when done interacting (and pressing `p`) with the browser.%n");
            br.readLine();
        }
    }

    private class DrivenHTMLLogger {

        final HostConfig hf = HostConfig.builder()
                .binds(
                        instrumentationDir.toAbsolutePath().toString() + ":/wkd",
                        jalangilogger.toAbsolutePath().toString() + ":/jalangilogger"
                ).build();

        public DrivenHTMLLogger() {
        }

        private void checkAllCanBeShared(DockerClient docker) throws Exception {
            final ContainerConfig containerConfig = ContainerConfig.builder()
                    .image("busybox:latest")
                    .hostConfig(hf)
                    .cmd("sh", "-c", "ls /wkd && ls /jalangilogger")
                    .build();
            final ContainerCreation creation = docker.createContainer(containerConfig);
            String id = creation.id();
            docker.startContainer(id);
            if (docker.waitContainer(id).statusCode() != 0) {
                String msg = String.format("Check the docker configuration, both %s and %s need to be among the 'shared folders'", instrumentationDir.toAbsolutePath().toString(), jalangilogger.toAbsolutePath().toString());
                throw new RuntimeException(msg);
            }
        }

        String mkCmd(String jalangidir, String wd) {
            return String.format("cd '%s/browser_driver' && scripts/container/cycle '%s' '%s'", jalangidir, wd, rootRelativeMain.toString());
        }

        private void runInDocker() throws Exception {
            // Create a client based on DOCKER_HOST and DOCKER_CERT_PATH env vars
            final DockerClient docker = DefaultDockerClient.fromEnv().build();

            checkAllCanBeShared(docker);

            String imageName = "algobardo/tajsound:latest";

            // Pull an image
            //docker.pull(imageName);

            String cmd = mkCmd("/jalangilogger", "/wkd");

            final ContainerConfig containerConfig = ContainerConfig.builder()
                    .image(imageName)
                    .hostConfig(hf)
                    .cmd("bash", "-c", cmd)
                    .attachStderr(true)
                    .attachStdout(true)
                    .build();

            final ContainerCreation creation = docker.createContainer(containerConfig);

            final String id = creation.id();

            // Start container
            docker.startContainer(id);

            docker.waitContainer(id);

            System.out.println("Docker log:");
            System.out.println(docker.logs(id,
                    DockerClient.LogsParam.stdout(),
                    DockerClient.LogsParam.stderr())
                    .readFully());

            // Remove container
            docker.removeContainer(id);

            // Close the docker client
            docker.close();
        }

        private boolean isDockerEnvironment() {
            return new File("/.dockerenv").exists();
        }

        private void captureLog() {
            try {
                Process p = exec(jalangilogger.resolve("browser_driver"), true, "bash", "-c", mkCmd(jalangilogger.toAbsolutePath().toString(), instrumentationDir.toAbsolutePath().toString()));
                Thread.sleep(1000);
                if (!p.isAlive()) {
                    throw new RuntimeException();
                }
                int res = p.waitFor();
                if (res != 0) throw new RuntimeException("Failed generating log\n" + p.getErrorStream());
            } catch (IOException e) {
                throw new RuntimeException(e);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }

        public RawLogFile log() throws IOException, InstrumentationSyntaxErrorException, InstrumentationTimeoutException {
            instrument(Environment.DRIVEN_BROWSER);

            try {
                if (isDockerEnvironment()) {
                    captureLog();
                } else {
                    runInDocker();
                }
            } catch (Exception e) {
                throw new RuntimeException(e);
            }

            return makeRawLogFile("success", instrumentationDir.resolve("NEW_LOG_FILE.log")); // XXX we do not know that?!
        }
    }

    private class JSLogger {

        private final Environment environment;

        private JSLogger(Environment environment) {
            this.environment = environment;
        }

        public RawLogFile log() throws IOException, InstrumentationException {
            instrument(environment);
            String exitStatus = run();
            return makeRawLogFile(exitStatus, instrumentationDir.resolve("NEW_LOG_FILE.log"));
        }

        private String run() throws IOException {
            List<String> cmd;
            switch (environment) {
                case NODE:
                case NODE_GLOBAL:
                    Path direct_js = jalangilogger.resolve("node_modules/jalangi2").resolve("src/js/commands/direct.js").toAbsolutePath();
                    String script = direct_js.toString();
                    Path commandLineMain = environment == Environment.NODE ? rootRelativeMain : makeGlobalifier(rootRelativeMain);
                    cmd = new ArrayList<>(Arrays.asList(new String[]{node.toString(), script, "--analysis", analysis.toString(), commandLineMain.toString()}));
                    break;
                case NASHORN:
                    cmd = new ArrayList<>(Arrays.asList(new String[]{jjs.toString(), rootRelativeMain.toString(), "--"}));
                    break;
                default:
                    throw new UnsupportedOperationException("Unhandled environment kind: " + environment);
            }
            addPreambles(cmd);
            Process p = exec(instrumentationDir, cmd.toArray(new String[cmd.size()]));
            boolean timeout;
            try {
                timeout = !p.waitFor(timeLimit, TimeUnit.SECONDS);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            } finally {
                try {
                    // XXX an attempt to kill zombie nodejs-processes for good.
                    p.destroy();
                    p.waitFor(1, TimeUnit.SECONDS);
                    p.destroyForcibly();
                    p.waitFor(1, TimeUnit.SECONDS);
                } catch (InterruptedException e) {
                    // ignore
                } finally {
                    if (p.isAlive()) {
                        throw new IllegalStateException("Could not kill process!?!");
                    }
                }
            }
            if (timeout)
                return "timeout";
            boolean failure = p.exitValue() != 0;
            p.destroy();
            return failure ? "failure" : "success";
        }

        /**
         * Makes a wrapper-file that loads the main-file in a global context (instead of the node-module context)
         */
        private Path makeGlobalifier(Path mainFile) {
            try {
                Path globalifier = Files.createTempFile("globalifier", ".js");
                Files.write(globalifier, Arrays.asList(
                        "var fs = require('fs');",
                        "var globalEval = eval;",
                        String.format("(globalEval)(fs.readFileSync('%s', 'utf-8'));", mainFile.toString())
                ), StandardOpenOption.TRUNCATE_EXISTING);
                return globalifier;
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    private class InstrumentationException extends Exception {

    }

    private class InstrumentationSyntaxErrorException extends InstrumentationException {

    }

    private class InstrumentationTimeoutException extends InstrumentationException {

    }
}
