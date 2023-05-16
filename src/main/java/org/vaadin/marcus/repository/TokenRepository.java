package org.vaadin.marcus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.vaadin.marcus.entity.Token;

public interface TokenRepository extends JpaRepository<Token, String> {
}
