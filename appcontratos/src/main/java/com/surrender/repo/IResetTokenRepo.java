package com.surrender.repo;

import java.util.List;
import java.util.Optional;

import com.surrender.model.ResetToken;
import com.surrender.model.ResetTokenType;

public interface IResetTokenRepo extends IGenericRepo<ResetToken, Integer> {
	
	Optional<ResetToken> findByToken(String token);
	
	List<ResetToken> findByIdEntityAndTokenType(Integer idEntity, ResetTokenType tokenType);
}
