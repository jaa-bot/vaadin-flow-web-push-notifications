package org.vaadin.marcus.webpush;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;
import nl.martijndwars.webpush.Subscription.Keys;
import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.jose4j.lang.JoseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.vaadin.marcus.controller.TokenController;
import org.vaadin.marcus.entity.Token;
import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.security.Security;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

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
            System.out.println("EN EL METODO SEND NOTIFICATION: " + subscription.getEndpoint());
            System.out.println(" auth: " + subscription.getAuth() + " p256dh: " + subscription.getP256dh());

            HttpResponse response = pushService.send(new Notification(new Subscription(subscription.getEndpoint(),
                    new Keys(subscription.getAuth(), subscription.getP256dh())), messageJson));

                    System.out.println("holaaaaaaaaa");

                    

            int statusCode = response.getStatusLine().getStatusCode();
            if (statusCode != 201) {
                System.out.println("Error del servidor, codigo del error:" + statusCode);
                InputStream content = response.getEntity().getContent();
                List<String> strings = IOUtils.readLines(content, "UTF-8");
                System.out.println(strings);
            }
        } catch (GeneralSecurityException | IOException | JoseException | ExecutionException
                | InterruptedException e) {
                    System.out.println("YEEEAAAAH BUDDY");
            e.printStackTrace();
        }
    }

    // metodo para agregar al usuario a la memoria y enviarle notificaciones
    public void subscribe(Token subscription) {
        System.out.println("Endpoint: " + subscription.getEndpoint() + " auth: " + subscription.getAuth() + " p256dh: "
                + subscription.getP256dh());

                System.out.println("ID DEL SUBCRIBE: " + subscription.getEndpoint());

                guardarToken(new Token(subscription.getEndpoint(), subscription.getAuth(), subscription.getP256dh(), "JUAN"));


        // solo usaremos la URL del punto final como clave para almacenar suscripciones
        // en la memoria.
        // objetivo es guardar id del usuario y lo que necesita para enviar
        // notificaciones que son el endpoint, auth, p256dh
        endpointToSubscription.add(subscription);
    }

    // metodo que elimina el endpoint del mapa de las suscripciones
    public void unsubscribe(Token subscription) {
        System.out.println("Se fue:  " + subscription.getEndpoint());

        System.out.println("ID DEL UNSUBCRIBE: " + subscription.getEndpoint());

        eliminarToken(subscription.getEndpoint());
        endpointToSubscription.remove(subscription);
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

            for(int i = 0; i < endpointToSubscription.size(); i++){
                sendNotification(endpointToSubscription.get(i), msg);
            }
            (endpointToSubscription).forEach(subscription -> {
                System.out.println("QUEEEE PASAAA??   " + subscription);
                sendNotification(subscription, msg);
            });
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    /*
     * public void notifyOneUser(String title, String body, int userId) {
     * try {
     * String msg = mapper.writeValueAsString(new Message(title, body));
     * (endpointToSubscription).forEach(subscription -> {
     * //aqui un if que compare si existe en la base de datos un usuario con ese id
     * if (existeUser(userId)) {
     * sendNotification(subscription, msg);
     * }
     * else{
     * System.out.println("No existe el usuario con id: " + userId);
     * }
     * });
     * } catch (JsonProcessingException e) {
     * e.printStackTrace();
     * throw new RuntimeException(e);
     * }
     * }
     */

    public void guardarToken(Token token) {
        tokenController.añadirToken(token);

    }

    public void eliminarToken(String endpoint) {
        tokenController.eliminarToken(endpoint);
    }

}
