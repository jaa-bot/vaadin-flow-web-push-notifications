/**Este es un componente de LitElement que se encarga de 
 * controlar la suscripción del usuario a las notificaciones push. */
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '@vaadin/button';
import '@vaadin/checkbox';
import { CheckboxCheckedChangedEvent } from "@vaadin/checkbox";

@customElement('web-push-toggle')/** es un decorador que define el nombre del elemento personalizado que se creará en la página*/
export class WebPushToggle extends LitElement {
  @property({ type: String }) caption = 'Suscribirse a las notificaciones push'; //es un decorador que define una propiedad para la clase. 
  @property({ type: String }) publicKey = '';
  @state() denied = Notification.permission === 'denied';/**es un decorador que define una variable de estado para la clase. */
  @state() subscribed = false;

  static styles = css`
    :host {
      display: block;
    }
  `;
  /**el método devuelve un vaadin-checkbox que permite al usuario activar o desactivar la suscripción a las notificaciones push.*/
  render() {
    return html`
        ${this.denied
        ? html` <b> Tienes las notificaciones bloqueadas. Necesitas habilitarlo manuelmante desde tu navegador</b> `
        : nothing}
        <vaadin-checkbox 
                ?checked=${this.subscribed} 
                label=${this.caption}
                @checked-changed=${this.updateSubscription}
        ></vaadin-checkbox>

    `;
  }

  first = true;
  updateSubscription(e: CheckboxCheckedChangedEvent) {

    // The checkbox fires an event on initialization, ignore it.
    if (this.first) {
      this.first = false;
      return;
    }

    // El valor de la casilla de verificación se establece en la inicialización en función de la suscripción del trabajador del servicio.
    // No volver a suscribirse si ya estamos suscritos.
    if (e.detail.value === this.subscribed) {
      return;
    }
    if (e.detail.value) {
      this.subscribe();
    } else {
      this.unsubscribe();
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    const registration = await navigator.serviceWorker.getRegistration();
    this.subscribed = !!(await registration?.pushManager.getSubscription());
  }

  /*tokenURL = 'https://localhost:8090/token/'

  constructor(private httpClient: HttpClient) {
    super();
  }

  public save(token: Token): Observable<any> {
    return this.httpClient.post<any>(this.tokenURL + 'create', token);
  }*/

  private isValidString(str: any): str is string {
    return typeof str === 'string' && str.trim().length > 0;
  }

  async subscribe() {
    const notificationPermission = await Notification.requestPermission();

    if (notificationPermission === 'granted') {
      const registration = await navigator.serviceWorker.getRegistration();
      const subscription = await registration?.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.isValidString(this.publicKey) ? this.urlB64ToUint8Array(this.publicKey) : undefined,
      });
      /*const authKey = subscription?.getKey('auth');
      const authP256dh = subscription?.getKey('p256dh');
      const token = new Token(" ", subscription!.endpoint, authKey ? btoa(String.fromCharCode(...new Uint8Array(authKey))) : '',
        authP256dh ? btoa(String.fromCharCode(...new Uint8Array(authP256dh))) : '');
      //this.save(token);*/

      if (subscription) {
        this.subscribed = true;
        this.dispatchEvent(new CustomEvent('web-push-subscribed', {
          bubbles: true,
          composed: true,
          // Serialize keys uint8array -> base64
          detail: JSON.parse(JSON.stringify(subscription))
        }));

      }

    } else {
      this.denied = true;
    }
  }

  async unsubscribe() {
    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration?.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();

      this.dispatchEvent(new CustomEvent('web-push-unsubscribed', {
        bubbles: true,
        composed: true,
        // Serialize keys uint8array -> base64
        detail: JSON.parse(JSON.stringify(subscription))
      }));

      this.subscribed = false;
    }
  }

  private urlB64ToUint8Array(base64String: string) {
    console.log("sueña con algo mas complicado");
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
