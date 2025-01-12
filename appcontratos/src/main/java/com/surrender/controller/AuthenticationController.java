package com.surrender.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.surrender.model.ResetToken;
import com.surrender.model.ResetTokenType;
import com.surrender.model.Vendedor;
import com.surrender.service.IResetTokenService;
import com.surrender.service.IVendedorService;
import com.surrender.service.impl.AuthenticationService;
import com.surrender.util.EmailUtil;
import com.surrender.util.Mail;

import dto.AuthenticationResponse;
import dto.ResetPasswordRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

	@Value("${frontend.restablecer.password.url}")
    private String frontEndHost;
	
	@Autowired
	private AuthenticationService authService;
	
	@Autowired
	private IVendedorService serviceVendedor;
	
	@Autowired
	private EmailUtil emailUtil;
	
	@Autowired
	private IResetTokenService serviceResetToken;
		
	@PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody Vendedor request
    ) {
		AuthenticationResponse response = authService.authenticate(request);
		if(response.getAccessToken() != null) {
			return new ResponseEntity<AuthenticationResponse>(response, HttpStatus.OK);
		} else {
			return new ResponseEntity<AuthenticationResponse>(response, HttpStatus.UNAUTHORIZED);
		}
    }
	
	@PostMapping("/refresh_token")
    public ResponseEntity refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        return authService.refreshToken(request, response);
    }
	
	@GetMapping("/recover_password/{correo}")
	public ResponseEntity recoverPassword(@PathVariable String correo) throws Exception {
		Optional<Vendedor> optVendedor = serviceVendedor.listarPorCorreo(correo);
		if (optVendedor.isPresent()) {
			Vendedor vendedor = optVendedor.get();
			
			List<ResetToken> listaTokens = serviceResetToken.listarPorIdentityIdAndResetTokenType(vendedor.getId(), ResetTokenType.RECOVER_PASSWORD_VENDEDOR);
			serviceResetToken.deleteAllResetTokenByIdentity(listaTokens);
			
			ResetToken resetToken = new ResetToken();
			resetToken.setIdEntity(vendedor.getId());
			resetToken.setToken(UUID.randomUUID().toString());
			resetToken.setTokenType(ResetTokenType.RECOVER_PASSWORD_VENDEDOR);
			resetToken.setExpiracion(10);
			
			serviceResetToken.registrar(resetToken);
			
			Mail mail = new Mail();
			mail.setTo(vendedor.getCorreo());
			mail.setSubject("Restablecer Contraseña");
			mail.setTemplate("email/reset-password-template");
			
			String urlRestablecer = frontEndHost + "/restablecer/" + resetToken.getToken();
			
			Map<String, Object> model = new HashMap<>();
			model.put("nombreUsuario", vendedor.getNombres());
			model.put("enlaceRestablecer", urlRestablecer);
			
			mail.setModel(model);
			
			emailUtil.enviarMail(mail);
			
			return new ResponseEntity(HttpStatus.OK);
		}
		else {
			Vendedor v = new Vendedor();
			return new ResponseEntity(HttpStatus.NOT_FOUND);
		}
		
	}
	
	@PutMapping("/reset_password")
	public ResponseEntity postMethodName(@RequestBody ResetPasswordRequest resetPassword) throws Exception {
		Optional<ResetToken> optionalReset = serviceResetToken.listarPorToken(resetPassword.getToken());
		if (optionalReset.isPresent()) {
			ResetToken reset = optionalReset.get();
			if (!reset.isExpired()) {
				if (reset.getTokenType() == ResetTokenType.RECOVER_PASSWORD_VENDEDOR) {
					Vendedor vendedor = serviceVendedor.listarPorId(reset.getIdEntity());
					if(vendedor.isEstado()) {
						int filasAfectadas = authService.modificarPasswordPorId(vendedor.getId(), resetPassword.getPassword());
						if (filasAfectadas > 0) {
							serviceResetToken.eliminar(reset.getId());
							return new ResponseEntity(HttpStatus.OK);
						} else {
							return new ResponseEntity(HttpStatus.FAILED_DEPENDENCY);
						}
					} else {
						return new ResponseEntity(HttpStatus.UNAUTHORIZED);
					}
				} else {
					return new ResponseEntity(HttpStatus.CONTINUE);
				}
			} else {
				return new ResponseEntity(HttpStatus.PRECONDITION_FAILED);
			}
			
		} else {
			return new ResponseEntity(HttpStatus.NOT_FOUND);
		}
		
	}
	
}
