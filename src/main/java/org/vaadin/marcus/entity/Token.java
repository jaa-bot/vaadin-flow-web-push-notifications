package org.vaadin.marcus.entity;

import jakarta.persistence.*;

@Entity
public class Token {

    @Id
    private String endpoint;

    private String auth;
    private String p256dh;
    private String id_user;

    public Token(String endpoint, String auth, String p256dh, String id_user) {
        this.endpoint = endpoint;
        this.auth = auth;
        this.p256dh = p256dh;
        this.id_user = id_user;
    }

    public Token(String endpoint, String auth, String p256dh) {
        this.endpoint = endpoint;
        this.auth = auth;
        this.p256dh = p256dh;
    }

    public Token() {
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getAuth() {
        return auth;
    }

    public void setAuth(String auth) {
        this.auth = auth;
    }

    public String getP256dh() {
        return p256dh;
    }

    public void setP256dh(String p256dh) {
        this.p256dh = p256dh;
    }

    public String getIdUser() {
        return id_user;
    }

    public void setIdUser(String id_user) {
        this.id_user = id_user;
    }
}
