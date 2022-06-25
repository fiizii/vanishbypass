# vanish bypass
Minecraft server vanish bypass, works with most plugins &lt;3
<br />
An example implementation would have code like:<br />
```java
package net.wurstclient.commands;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.lang.reflect.Array;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;

import net.minecraft.client.network.ServerInfo;
import net.wurstclient.DontBlock;
import net.wurstclient.command.CmdException;
import net.wurstclient.command.CmdSyntaxError;
import net.wurstclient.command.Command;
import net.wurstclient.util.ChatUtils;
import net.wurstclient.util.LastServerRememberer;
import net.wurstclient.util.MathUtils;
import net.minecraft.client.MinecraftClient;

@DontBlock
public final class AvCmd extends Command {

    public AvCmd() {
        super("av", "Detects if a <player> is vanished.",
                ".av", "Detects if a <player> is vanished.");
    }
    public static String getHTML(String urlToRead) throws Exception {
        StringBuilder result = new StringBuilder();
        URL url = new URL(urlToRead);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(conn.getInputStream()))) {
            for (String line; (line = reader.readLine()) != null; ) {
                result.append(line);
            }
        }
        return result.toString();
    }
    private String getIP()
    {
        ServerInfo lastServer = LastServerRememberer.getLastServer();
        if(lastServer == null || MC.isIntegratedServerRunning())
            return "127.0.0.1:25565";

        String ip = lastServer.address;
        if(!ip.contains(":"))
            ip += ":25565";

        return ip;
    }
    private static final MinecraftClient mc = MinecraftClient.getInstance();
    @Override
    public void call(String[] args) throws CmdException {
        String arg = args.length > 0 ? args[0] : "1"; // if no player is specified, assume the player is the player
        String response = "";
        String port = "";
        String ip = "";
        String ipp = getIP();
        try {
            ip = ipp.split(":")[0];
            port = ipp.split(":")[1];
            response = getHTML("http://localhost:8000/check/" + arg + "?ip=" + ip +"&port="+ port);
            System.out.println("[WURST][AV]: "+response);
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (response == null) {
            ChatUtils.message("Could not connect to the AV server.");
            return;
        }
        if (response.equals("true")) {
            ChatUtils.message("Player " + arg + " is vanished.");
        } else if (response.equals("false")) {
            ChatUtils.message("Player " + arg + " is not vanished.");
        } else {
            ChatUtils.message("Player " + arg + " is not found.");
        }
    }
}
``` 
<br />
above is an implementation as a wurst command (not hack in the menu)<br />
# SETUP
<br />
npm init -y && npm i express axios minecraft-server-util
<br />
# Options
<br />
port: the port the server listens on<br />
default_ip: the ip the server refers to as default <br />
default_port: the port the server refers to as default <br />
On_Error_Assume_Player_Is_Online: assumes player is online if enabled to true (on error/timeout)
