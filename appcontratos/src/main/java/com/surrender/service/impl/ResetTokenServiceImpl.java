package com.surrender.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surrender.model.ResetToken;
import com.surrender.model.ResetTokenType;
import com.surrender.repo.IGenericRepo;
import com.surrender.repo.IResetTokenRepo;
import com.surrender.service.IResetTokenService;

@Service
public class ResetTokenServiceImpl extends CRUDImpl<ResetToken, Integer> implements IResetTokenService {

	@Autowired
	private IResetTokenRepo repo = null;
	
	@Override
	protected IGenericRepo<ResetToken, Integer> getRepo() {
		return repo;
	}
	
	@Override
	public Optional<ResetToken> listarPorToken(String token) {
		return repo.findByToken(token);
	}

	@Override
	public List<ResetToken> listarPorIdentityIdAndResetTokenType(Integer identityId, ResetTokenType tokenType) {
		return repo.findByIdEntityAndTokenType(identityId, tokenType);
	}

	@Override
	public void deleteAllResetTokenByIdentity(List<ResetToken> listaToken) {
        if(listaToken.isEmpty()) {
            return;
        }

        repo.deleteAll(listaToken);
    }
}
