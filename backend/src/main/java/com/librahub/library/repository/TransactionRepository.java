package com.librahub.library.repository;

import com.librahub.library.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByStatus(Transaction.Status status);
    List<Transaction> findByMemberId(Long memberId);
    long countByStatus(Transaction.Status status);
}
