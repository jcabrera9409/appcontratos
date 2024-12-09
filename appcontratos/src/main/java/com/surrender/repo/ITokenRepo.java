package com.surrender.repo;

import java.util.List;
import java.util.Optional;

import com.surrender.model.Token;

public interface ITokenRepo extends IGenericRepo<Token, Integer> {

	List<Token> findByObjVendedorIdAndLoggedOutFalse(Integer vendedorId);
	
	Optional<Token> findByAccessToken(String token);

    Optional<Token> findByRefreshToken(String token);
	
}
