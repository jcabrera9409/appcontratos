package com.surrender.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.surrender.model.Token;
import com.surrender.model.Vendedor;
import com.surrender.repo.ITokenRepo;
import com.surrender.repo.IVendedorRepo;

import dto.AuthenticationResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class AuthenticationService {

	@Autowired
	private IVendedorRepo repository;
    
	@Autowired
	private PasswordEncoder passwordEncoder;
    
	@Autowired
	private JwtService jwtService;

	@Autowired
    private ITokenRepo tokenRepository;

	@Autowired
    private AuthenticationManager authenticationManager;
	
	public AuthenticationResponse authenticate(Vendedor request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        Vendedor vendedor = repository.findByCorreo(request.getUsername()).orElseThrow();
        
        if(vendedor.isEstado()) {
        	String accessToken = jwtService.generateAccessToken(vendedor);
            String refreshToken = jwtService.generateRefreshToken(vendedor);

            revokeAllTokenByVendedor(vendedor);
            saveUserToken(accessToken, refreshToken, vendedor);

            return new AuthenticationResponse(accessToken, refreshToken, "Vendedor autenticado correctamente");
        } else {
        	return new AuthenticationResponse(null, null, "Su cuenta esta desactivada.");
        }
    }
	
	public void revokeAllTokenByVendedor(Vendedor vendedor) {
        List<Token> validTokens = tokenRepository.findByObjVendedorIdAndLoggedOutFalse(vendedor.getId());
        if(validTokens.isEmpty()) {
            return;
        }

        validTokens.forEach(t-> {
            t.setLoggedOut(true);
        });

        tokenRepository.saveAll(validTokens);
    }
	
	private void saveUserToken(String accessToken, String refreshToken, Vendedor vendedor) {
        Token token = new Token();
        token.setAccessToken(accessToken);
        token.setRefreshToken(refreshToken);
        token.setLoggedOut(false);
        token.setObjVendedor(vendedor);
        tokenRepository.save(token);
    }
	
	public ResponseEntity refreshToken(
            HttpServletRequest request,
            HttpServletResponse response) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7);

        String correo = jwtService.extractUsername(token);

        Vendedor vendedor = repository.findByCorreo(correo)
                .orElseThrow(()->new RuntimeException("Correo no encontrado"));

        if(jwtService.isValidRefreshToken(token, vendedor)) {
            String accessToken = jwtService.generateAccessToken(vendedor);
            String refreshToken = jwtService.generateRefreshToken(vendedor);

            revokeAllTokenByVendedor(vendedor);
            saveUserToken(accessToken, refreshToken, vendedor);

            return new ResponseEntity(new AuthenticationResponse(accessToken, refreshToken, "Nuevo token generado"), HttpStatus.OK);
        }

        return new ResponseEntity(HttpStatus.UNAUTHORIZED);
    }
	
	public int modificarPasswordPorId(Integer id, String password) {
		int filasActualizadas = repository.updatePasswordById(id, passwordEncoder.encode(password));
		return filasActualizadas;
	}
	
	public boolean tieneAcceso(String path) {
    	boolean rpta = false;
    	String metodoRol = "";
    	
    	switch(path) {
    	case "cliente":
    	case "contrato":
    	case "plantilla-listar":
    	case "menu-listar-correo":
    	case "detalle-pago":
    	case "comprobante":
    		metodoRol="CONTADOR,VENDEDOR,ADMIN,ROOT";
    		break;
    	case "vendedor":
    	case "plantilla":
    	case "rol-listar":
    		metodoRol="ADMIN,ROOT";
    		break;
    	case "menu":
    	case "rol":
    		metodoRol="ROOT";
    		break;
    	}
    	
    	String metodoRoles[] = metodoRol.split(",");
    	
    	Authentication usuarioLogueado = SecurityContextHolder.getContext().getAuthentication();
    	
    	for(GrantedAuthority auth: usuarioLogueado.getAuthorities()) {
    		String rolUser = auth.getAuthority();
    		
    		for(String rolMet: metodoRoles) {
    			if(rolUser.equalsIgnoreCase(rolMet)) {
    				rpta = true;
    			}
    		}
    	}
    	
    	return rpta;
    }
	
}
