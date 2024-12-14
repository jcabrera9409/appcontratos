package com.surrender.service;

import java.util.List;
import java.util.Optional;

import com.surrender.model.ResetToken;
import com.surrender.model.ResetTokenType;

public interface IResetTokenService extends ICRUD<ResetToken, Integer>{
	
	Optional<ResetToken> listarPorToken(String token);
	
	List<ResetToken> listarPorIdentityIdAndResetTokenType(Integer identityId, ResetTokenType tokenType);

	void deleteAllResetTokenByIdentity(List<ResetToken> listaToken);
}
