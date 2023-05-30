package org.vaadin.marcus.webpush;

import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.security.Security;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.jose4j.lang.JoseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.vaadin.marcus.controller.TokenController;
import org.vaadin.marcus.entity.Token;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.annotation.PostConstruct;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;
import nl.martijndwars.webpush.Subscription.Keys;

@Service
public class WebPushService {

    @Value("${vapid.public.key}")
    private String publicKey;
    
    @Value("${vapid.private.key}")
    private String privateKey;
    
    @Value("${vapid.subject}")
    private String subject;
    

    private PushService pushService;

    @Autowired
    private TokenController tokenController;

    // almacena los endpoints de las suscripciones
    private final List<Token> endpointToSubscription = new ArrayList<>();

    // metodo para inicializar el pushService
    @PostConstruct
    private void init() throws GeneralSecurityException {
        Security.addProvider(new BouncyCastleProvider());
        // publicKey =
        // Base64.getEncoder().encodeToString(publicKey.getBytes(StandardCharsets.UTF_8));
        // privateKey =
        // Base64.getEncoder().encodeToString(privateKey.getBytes(StandardCharsets.UTF_8));
        pushService = new PushService(publicKey, privateKey, subject);
        this.endpointToSubscription.addAll(tokenController.list());
    }

    public String getPublicKey() {
        return publicKey;
    }

    // metodo que envia las notificaiones, que recibe el mansaje que tiene que
    // enviarle y el objeto tipo Subscription
    public void sendNotification(Token subscription, String messageJson) {
        try {
            System.out.println("-------------------------------------------------");
            System.out.println("EN EL METODO SEND NOTIFICATION: " + subscription.getEndpoint());
            System.out.println(" auth: " + subscription.getAuth() + " p256dh: " + subscription.getP256dh());

            Keys keys = new Keys(subscription.getP256dh(), subscription.getAuth());
            Subscription subs = new Subscription(subscription.getEndpoint(), keys);

            Notification notification = new Notification(subs, messageJson);

            HttpResponse response = pushService.send(notification);

            int statusCode = response.getStatusLine().getStatusCode();
            if (statusCode != 201) {
                System.out.println("Error del servidor, codigo del error:" + statusCode);
                InputStream content = response.getEntity().getContent();
                List<String> strings = IOUtils.readLines(content, "UTF-8");
                System.out.println(strings);
            }
        } catch (GeneralSecurityException | IOException | JoseException | ExecutionException
                | InterruptedException e) {
            e.printStackTrace();
        }
    }

    // metodo para agregar al usuario a la memoria y enviarle notificaciones
    public void subscribe(Token subscription) {
        System.out.println("-------------------------------------------------");
        System.out.println("Endpoint: " + subscription.getEndpoint() + " auth: " + subscription.getAuth() + " p256dh: "
                + subscription.getP256dh());

        System.out.println("-------------------------------------------------");
        System.out.println("ID DEL SUBCRIBE: " + subscription.getEndpoint());

        guardarToken(new Token(subscription.getEndpoint(), subscription.getAuth(), subscription.getP256dh(), "JUAN"));

        // solo usaremos la URL del punto final como clave para almacenar suscripciones
        // en la memoria.
        // objetivo es guardar id del usuario y lo que necesita para enviar
        // notificaciones que son el endpoint, auth, p256dh
        this.endpointToSubscription.clear();
        this.endpointToSubscription.addAll(tokenController.list());
        System.out.println("-------------------------------------------------");
        for (int i = 0; i < this.endpointToSubscription.size(); i++) {
            System.out.println(this.endpointToSubscription.get(i).getEndpoint());
        }
    }

    // metodo que elimina el endpoint del mapa de las suscripciones
    public void unsubscribe(Token subscription) {

        System.out.println("-------------------------------------------------");
        System.out.println("ID DEL UNSUBCRIBE: " + subscription.getEndpoint());
        ;

        eliminarToken(subscription.getEndpoint());

        this.endpointToSubscription.clear();
        this.endpointToSubscription.addAll(tokenController.list());
        System.out.println("-------------------------------------------------");
        for (int i = 0; i < this.endpointToSubscription.size(); i++) {
            System.out.println(this.endpointToSubscription.get(i).getEndpoint());
        }
    }

    public record Message(String title, String body) {
    }

    ObjectMapper mapper = new ObjectMapper();

    // enviar notificacion a todos los usuarios que se han suscrito
    public void notifyAll(String title, String body) {
        try {
            // crea un mensaje y envia la notificacion a todos los usuarios que se encuentan
            // en el mapa, con el metodo sendNotification
            String msg = mapper.writeValueAsString(new Message(title, body));

            for (int i = 0; i < endpointToSubscription.size(); i++) {
                sendNotification(endpointToSubscription.get(i), msg);
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public void notifyOneUser(String title, String body) {
        try {
            String msg = mapper.writeValueAsString(new Message(title, body));

            for (int i = 0; i < endpointToSubscription.size(); i++) {
                Optional<Token> token = tokenController.cogerId_user(endpointToSubscription.get(i).getEndpoint());
                
                if (token.get().getIdUser() .equals("JUAN")) {
                    sendNotification(endpointToSubscription.get(i), msg);
                }
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    // tengo que mirar esto bien
    public void guardarToken(Token token) {
        String endpoint = token.getEndpoint();
        String auth = token.getAuth();
        String p256dh = token.getP256dh();

        tokenController.añadirToken(new Token(endpoint, auth, p256dh, "JUAN"));
    }

    public void eliminarToken(String endpoint) {
        tokenController.eliminarToken(endpoint);
    }

    /*
     * public static String base64UrlEncode(String input) {
     * byte[] encodedBytes =
     * Base64.getUrlEncoder().encode(input.getBytes(StandardCharsets.UTF_8));
     * return new String(encodedBytes, StandardCharsets.UTF_8)
     * .replace("+", "-")
     * .replace("/", "_")
     * .replaceAll("=+$", "");
     * }
     * 
     * public static String base64UrlDecode(String input) {
     * input = input.replace("-", "+").replace("_", "/");
     * int padding = 4 - (input.length() % 4);
     * input += "=".repeat(padding);
     * 
     * byte[] decodedBytes =
     * Base64.getUrlDecoder().decode(input.getBytes(StandardCharsets.UTF_8));
     * return new String(decodedBytes, StandardCharsets.UTF_8);
     * }
     */

}
