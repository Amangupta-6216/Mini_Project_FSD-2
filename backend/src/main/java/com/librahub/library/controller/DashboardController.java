package com.librahub.library.controller;

import com.librahub.library.dto.DashboardStats;
import com.librahub.library.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final BookService bookService;
    private final MemberService memberService;
    private final TransactionService txService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> stats() {
        return ResponseEntity.ok(new DashboardStats(
                bookService.count(),
                memberService.count(),
                txService.issuedCount(),
                txService.overdueCount(),
                bookService.availableCount()
        ));
    }
}
