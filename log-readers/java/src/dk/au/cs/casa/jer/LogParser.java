package dk.au.cs.casa.jer;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonObject;
import dk.au.cs.casa.jer.entries.AllocationSiteObjectDescription;
import dk.au.cs.casa.jer.entries.BuiltinObjectDescription;
import dk.au.cs.casa.jer.entries.CallEntry;
import dk.au.cs.casa.jer.entries.ConcreteStringDescription;
import dk.au.cs.casa.jer.entries.DynamicCodeEntry;
import dk.au.cs.casa.jer.entries.FunctionEntry;
import dk.au.cs.casa.jer.entries.FunctionExitEntry;
import dk.au.cs.casa.jer.entries.IEntry;
import dk.au.cs.casa.jer.entries.ObjectDescription;
import dk.au.cs.casa.jer.entries.OtherDescription;
import dk.au.cs.casa.jer.entries.OtherObjectDescription;
import dk.au.cs.casa.jer.entries.SourceLocation;
import dk.au.cs.casa.jer.entries.ValueDescription;
import dk.au.cs.casa.jer.entries.VariableOrPropertyEntry;

import java.io.BufferedReader;
import java.io.FileReader;
import java.nio.file.Path;
import java.util.HashSet;
import java.util.Set;

/**
 * Parser for an entire ValueLogger log file.
 */
public class LogParser {

    private Set<IEntry> entries = new HashSet<>();

    public LogParser (Path logFile) {
        Gson gson = makeGsonParser();
        String line = null;
        try (FileReader fr = new FileReader(logFile.toFile()); BufferedReader br = new BufferedReader(fr)) {
            while ((line = br.readLine()) != null) {
                IEntry e = gson.fromJson(line, IEntry.class);
                if (e != null) {
                    entries.add(e);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        	throw new RuntimeException(String.format("Error during parsing of line: %n%s", line), e);
        }
    }

    private Gson makeGsonParser() {
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(VariableOrPropertyEntry.class, (JsonDeserializer<VariableOrPropertyEntry>) (json, typeOfT, context) -> {
            JsonObject obj = json.getAsJsonObject();
            SourceLocation sourceLocation = context.deserialize(obj.get("sourceLocation"), SourceLocation.class);
            ValueDescription name = context.deserialize(obj.get("name"), ValueDescription.class);
            ValueDescription value = context.deserialize(obj.get("value"), ValueDescription.class);
            return new VariableOrPropertyEntry(sourceLocation, name, value);
        });
        builder.registerTypeAdapter(SourceLocation.class, (JsonDeserializer<SourceLocation>) (json, typeOfT, context) -> {
            JsonObject obj = json.getAsJsonObject();
            return new SourceLocation(obj.get("lineNumber").getAsInt(), obj.get("columnNumber").getAsInt(), obj.get("fileName").getAsString());
        });
        builder.registerTypeAdapter(ValueDescription.class, (JsonDeserializer<ValueDescription>) (json, typeOfT, context) -> {
            JsonObject obj = json.getAsJsonObject();
            String valueKind = obj.get("valueKind").getAsString();
            switch (valueKind) {
                case "concrete-string":
                    return new ConcreteStringDescription(obj.get("value").getAsString());
                case "abstract-primitive":
                    return new OtherDescription(obj.get("value").getAsString());
                case "abstract-object":
                    return context.deserialize(obj.get("value"), ObjectDescription.class);
                default:
                    throw new RuntimeException("Unhandled case: " + valueKind);
            }
        });
        builder.registerTypeAdapter(ObjectDescription.class, (JsonDeserializer<ObjectDescription>) (json, typeOfT, ctx) -> {
            JsonObject obj = json.getAsJsonObject();
        	String objectKind = obj.get("objectKind").getAsString();
            switch (objectKind) {
                case "allocation-site":
                    return ctx.deserialize(obj, AllocationSiteObjectDescription.class);
                case "builtin":
                    return ctx.deserialize(obj, BuiltinObjectDescription.class);
                case "other":
                    return ctx.deserialize(obj, OtherObjectDescription.class);
                default:
                    throw new RuntimeException("Unhandled case: " + objectKind);
            }
        });

        builder.registerTypeAdapter(IEntry.class, (JsonDeserializer<IEntry>) (json, typeOfT, ctx) -> {
                    String entryKind = json.getAsJsonObject().get("entryKind").getAsString();
                    switch (entryKind) {
                        case "dynamic-code":
                            return ctx.deserialize(json, DynamicCodeEntry.class);
                        case "read-variable":
                        case "write-variable":
                        case "read-property":
                        case "write-property":
                            VariableOrPropertyEntry entry = ctx.deserialize(json, VariableOrPropertyEntry.class);
                            if("read-variable".equals(entryKind) && (entry.getVarOrProp() instanceof ConcreteStringDescription && "this".equals(((ConcreteStringDescription)entry.getVarOrProp()).getString()))){
                                return null;
                            }
                            return entry;
                        case "function-exit":
                            return ctx.deserialize(json, FunctionExitEntry.class);
                        case "function-entry":
                            return ctx.deserialize(json, FunctionEntry.class);
                        case "call":
                            return ctx.deserialize(json, CallEntry.class);
                        default:
                            throw new RuntimeException("Unhandled case: " + entryKind);
                    }
                }
        );
        return builder.create();
    }

    public Set<IEntry> getEntries() {
        return entries;
    }
}