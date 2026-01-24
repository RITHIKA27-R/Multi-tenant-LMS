package com.multi.tenant.course.filter;

import com.multi.tenant.course.context.TenantContext;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.security.Key;

@Component
@Order(1)
public class TenantFilter implements Filter {

    @Value("${jwt.secret}")
    private String secret;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        String authHeader = req.getHeader("Authorization");

        String tenantHeader = req.getHeader("X-Tenant-ID");
        if (tenantHeader != null) {
            try {
                Long tenantId = Long.valueOf(tenantHeader);
                TenantContext.setTenantId(tenantId);
            } catch (NumberFormatException e) {
                // Invalid header format
            }
        } else if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // Fallback to token if header is missing (e.g. direct call)
            String token = authHeader.substring(7);
            try {
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(getSignKey())
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                Long tenantId = claims.get("tenantId", Long.class);
                if (tenantId != null) {
                    TenantContext.setTenantId(tenantId);
                }
            } catch (Exception e) {
                // Token invalid
            }
        }

        try {
            chain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
