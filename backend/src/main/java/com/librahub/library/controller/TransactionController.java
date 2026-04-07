package com.librahub.library.controller;

import com.librahub.library.model.Transaction;
import com.librahub.library.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService txService;

    @GetMapping
    public ResponseEntity<List<Transaction>> getAll(Authentication authentication) {
        return ResponseEntity.ok(txService.getVisibleTransactions(authentication.getName(), isAdmin(authentication)));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<Transaction>> overdue(Authentication authentication) {
        return ResponseEntity.ok(txService.getVisibleOverdue(authentication.getName(), isAdmin(authentication)));
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Transaction>> byMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(txService.getByMember(memberId));
    }

    @PostMapping("/issue")
    public ResponseEntity<Transaction> issue(@RequestBody Map<String, Long> body, Authentication authentication) {
        return ResponseEntity.ok(txService.issueForMember(authentication.getName(), body.get("bookId")));
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<Transaction> returnBook(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(txService.returnBookForMember(authentication.getName(), id));
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
    }
}
