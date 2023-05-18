package org.vaadin.marcus.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.vaadin.marcus.entity.Token;
import org.vaadin.marcus.service.TokenService;

@RestController
@RequestMapping("/token")
@CrossOrigin(origins = "http://localhost:8090")
public class TokenController {

    @Autowired
    TokenService tokenService;

    public List<Token> list(){
        List<Token> list = tokenService.list();
        return list;
    }

    public ResponseEntity<?> añadirToken(@RequestBody Token token) {
        tokenService.save(token);
        return new ResponseEntity(null, HttpStatus.OK);
    }

    public ResponseEntity<?> eliminarToken(@PathVariable("endpoint")String endpoint) {
        tokenService.delete(endpoint);
        return new ResponseEntity(null, HttpStatus.OK);
    }

    public Optional<Token> cogerIdNavegador(@PathVariable("idNavegador")String id) {
        return tokenService.getOne(id);
    }
}
