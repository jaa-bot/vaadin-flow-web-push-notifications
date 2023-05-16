package org.vaadin.marcus.webpush;

import org.vaadin.marcus.entity.Token;

import com.vaadin.flow.component.*;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.shared.Registration;

//extiende de component, este componente se utiliza para permitir a los usuarios suscribirse o desuscribirse de las notificaciones web push en una aplicación web.
@Tag("web-push-toggle") // indica que este componente se debe representar en el DOM de la página como un
                        // elemento HTML con la etiqueta web-push-toggle
@JsModule("./web-push-toggle.ts") // La anotación @JsModule("./web-push-toggle.ts") indica que este componente se
                                  // implementa en un archivo TypeScript ubicado en la ruta ./web-push-toggle.ts.
public class WebPushToggle extends Component {

    // crea una nueva instancia del componente y establece la clave pública de web
    // push, que se utiliza para identificae al servidor que se envia las
    // notificaciones
    public WebPushToggle(String publicKey) {
        setPublicKey(publicKey);
    }

    // establece la clave publica de web push
    public void setPublicKey(String publicKey) {
        getElement().setProperty("publicKey", publicKey);
    }

    // se utiliza para establecer el texto que se muestra junto al componente.
    public void setCaption(String caption) {
        getElement().setProperty("caption", caption);
    }

    // Events

    /*
     * Esta clase se utiliza para representar eventos relacionados con la
     * suscripción a las notificaciones web push.
     * Tiene un atributo subscription que representa la suscripción a las
     * notificaciones.
     */
    public static class WebPushSubscriptionEvent extends ComponentEvent<WebPushToggle> {
        private final Token subscription;

        public WebPushSubscriptionEvent(WebPushToggle source,
                boolean fromClient,
                Token subscription) {
            super(source, fromClient);
            this.subscription = subscription;
        }

        public Token getSubscription() {
            return subscription;
        }
    }

    /*
     * SubscribeEvent y UnsubscribeEvent se utilizan para representar los eventos de
     * suscripción y desuscripción, respectivamente.
     * Estos eventos se activan cuando el usuario hace clic en el botón del
     * componente para suscribirse o desuscribirse de las notificaciones.
     */
    @DomEvent("web-push-subscribed")
    public static class SubscribeEvent extends WebPushSubscriptionEvent {
        public SubscribeEvent(
                WebPushToggle source,
                boolean fromClient,
                @EventData("event.detail.endpoint") String endpoint,
                @EventData("event.detail.keys.auth") String auth,
                @EventData("event.detail.keys.p256dh") String p256dh) {
            super(source, fromClient, new Token(endpoint, auth, p256dh));
        }
    }

    @DomEvent("web-push-unsubscribed")
    public static class UnsubscribeEvent extends WebPushSubscriptionEvent {

        public UnsubscribeEvent(
                WebPushToggle source,
                boolean fromClient,
                @EventData("event.detail.endpoint") String endpoint,
                @EventData("event.detail.keys.auth") String auth,
                @EventData("event.detail.keys.p256dh") String p256dh) {

            super(source, fromClient, new Token(endpoint, auth, p256dh));
        }
    }

    // se utiliza para agregar un ComponentEventListener que escucha el evento de
    // suscripción.

    public Registration addSubscribeListener(ComponentEventListener<SubscribeEvent> listener) {
        return addListener(SubscribeEvent.class, listener);
    }

    // se utiliza para agregar un ComponentEventListener que escucha el evento de
    // desuscripción
    public Registration addUnsubscribeListener(ComponentEventListener<UnsubscribeEvent> listener) {
        return addListener(UnsubscribeEvent.class, listener);
    }
}
