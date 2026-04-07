package com.librahub.library.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStats {
    private long totalBooks;
    private long totalMembers;
    private long issuedBooks;
    private long overdueBooks;
    private long availableBooks;
}
