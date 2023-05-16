package org.vaadin.marcus.service;

import org.vaadin.marcus.entity.Token;
import org.vaadin.marcus.repository.TokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TokenService {

    @Autowired
    private TokenRepository tokenRepository;

    public List<Token> list() {
        return tokenRepository.findAll();
    }
    public void save(Token token) {
        tokenRepository.save(token);
    }

    public void delete(String id) {
        tokenRepository.deleteById(id);
    }

    public Optional<Token> getOne(String id){
        return tokenRepository.findById(id);
    }

}
