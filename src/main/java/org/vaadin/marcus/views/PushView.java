package org.vaadin.marcus.views;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import org.vaadin.marcus.webpush.WebPushService;
import org.vaadin.marcus.webpush.WebPushToggle;

//titulo de la pagina
@PageTitle("Web Push")
//la ruta para acceder a la vista
@Route(value = "")
//este archivo represena una vista que se encarga de manejar notificaciones web push
public class PushView extends VerticalLayout {

    public PushView(WebPushService webPushService) {

        //WebPushToggle se utiliza para que los usuarios se suscriban o cancelen la suscripción.
        var toggle = new WebPushToggle(webPushService.getPublicKey());
        //Para que se pueda personalizar el mensaje
        var messageInput = new TextField("Mensaje:");
        //boton para enviar la notificaión a todos los usuarios
        var sendButton = new Button("Notificar a todos los usuarios! 📝");
        var messageLayout = new HorizontalLayout(messageInput, sendButton);
        messageLayout.setDefaultVerticalComponentAlignment(Alignment.BASELINE);

        //se añade un encabezado con el toggle y el mensaje
        add(
            new H1("Notificaciones Web Push"),
            toggle,
            messageLayout
        );

        //estos dos metodos son del WebPushToggle y del WebPushService, uno suscribe y otro lo cancela.
        toggle.addSubscribeListener(e -> {
            webPushService.subscribe(e.getSubscription());
        });
        toggle.addUnsubscribeListener(e -> {
            webPushService.unsubscribe(e.getSubscription());
        });

        //y por ultimo añade un listener al boton y utiliza el metodo notifiAll para enviar el mensaje
        sendButton.addClickListener(e -> webPushService.notifyAll("Mensaje del usuario", messageInput.getValue()));
    }
}